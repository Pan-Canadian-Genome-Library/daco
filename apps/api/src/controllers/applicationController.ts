import { Request, Response } from 'express';
import applicationService from '@/service/application-service.js';
import { getDbInstance } from '@/db/index.js';
import { OrderBy, type ApplicationService } from '@/service/types.js';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';

/**
 * Handles the creation of a new application.
 * Endpoint: POST /applications
 */
export const createApplicationController = async (req: Request, res: Response) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const database = getDbInstance();
	const service: ApplicationService = applicationService(database);
    const result = await service.createApplication({ user_id });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error creating application:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Handles editing an existing application.
 * Endpoint: PUT /applications/:id
 */
export const editApplicationController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const update = req.body;

  if (!id || !update) {
    return res.status(400).json({ success: false, message: 'Application ID and update data are required' });
  }

  try {
    const database = getDbInstance();
	const service: ApplicationService = applicationService(database);
    const result = await service.editApplication({ id: Number(id), update });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error editing application:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Fetches all applications based on filters.
 * Endpoint: GET /applications
 */
export const getAllApplicationsController = async (req: Request, res: Response) => {
  const { userId, state, sort, page, pageSize } = req.query;

  try {
    const database = getDbInstance();
	const service: ApplicationService = applicationService(database);
    const result = await service.listApplications({ 
        user_id: userId as string | undefined,
      state: state as ApplicationStateValues | undefined,
      sort: sort ? [sort as OrderBy<"user_id" | "id" | "created_at" | "updated_at" | "state" | "approved_at" | "expires_at" | "contents">] : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
     });

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Fetches a single application by ID.
 * Endpoint: GET /applications/:id
 */
export const getApplicationByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Application ID is required' });
  }

  try {
    const database = getDbInstance();
	const service: ApplicationService = applicationService(database);
    const result = await service.getApplicationById({ id: Number(id) });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error fetching application:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
