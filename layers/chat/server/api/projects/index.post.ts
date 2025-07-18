import { createProject } from '../../repository/projectRepository';
import { CreateProjectSchema } from '../../schemas';

export default defineEventHandler(async (event) => {
  const { success, data } = await readValidatedBody(event, CreateProjectSchema.safeParse);

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body'
    });
  }

  return createProject(data);
});
