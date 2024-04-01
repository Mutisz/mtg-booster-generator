import { SourceType } from '../state';
import { ErrorWithHelp } from './ErrorWithHelp';

export class CollectionSearchError extends Error implements ErrorWithHelp {
  source: SourceType;
  help: string | null;

  constructor(message: string, source: SourceType, help: string | null) {
    super(message);
    this.name = 'CollectionSearchError';
    this.source = source;
    this.help = help;
  }

  formatHelp = () => `
  Searching collection in ${this.source} failed. 
  ${this.help}
  `;
}
