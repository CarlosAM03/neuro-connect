import { SummaryContext } from './summary-context.dto';
export interface GeneratedSummary {
  content: string;
  provider: string;
  model: string;
}
export interface AiProvider {
  generateSummary(context: SummaryContext): Promise<GeneratedSummary>;
}
export const AI_PROVIDER = Symbol('AI_PROVIDER');
