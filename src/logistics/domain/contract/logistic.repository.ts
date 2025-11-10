import Logistic from '../models/logistic';

export interface LogisticRepository {
  createLogistic(logistic: Logistic): Promise<any>;
  findAllAvailableLogistics(): Promise<Logistic[]>;
  UpdateStatusLogisticByID(
    id: string,
    user_id: string,
    is_available: boolean,
  ): Promise<any>;
  findAllLogisticByUserID(user_id: string): Promise<Logistic[]>;
  findLogisticByID(id: string): Promise<Logistic>;
  updateLogisticByID(id: string, logistic: Logistic): Promise<any>;
}
