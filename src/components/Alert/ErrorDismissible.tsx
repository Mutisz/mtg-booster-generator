import { ComponentType } from 'react';
import Alert from 'react-bootstrap/Alert';
import { FallbackProps } from 'react-error-boundary';

import { CollectionSearchError } from '../../errors/CollectionSearchError';

const ErrorDismissible: ComponentType<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const help = error instanceof CollectionSearchError ? error.formatHelp() : null;
  return (
    <Alert variant="danger" onClose={resetErrorBoundary} dismissible>
      <Alert.Heading>Error!</Alert.Heading>
      <p>{(error as Error).message}</p>
      {help !== null ? <p>{help}</p> : <></>}
    </Alert>
  );
};

export default ErrorDismissible;
