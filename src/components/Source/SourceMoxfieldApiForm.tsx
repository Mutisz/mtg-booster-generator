import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { useActionProgress } from '../../hooks/useActionProgress';
import { usePreferences } from '../../hooks/usePreferences';
import { useSearchMoxfieldApi } from '../../hooks/useSearchMoxfieldApi';
import { useSourceMoxfield } from '../../hooks/useSourceMoxfield';
import { defaults } from '../../state';

const SourceMoxfieldApiForm: React.FC = () => {
  const { sourceMoxfield, setSourceMoxfield } = useSourceMoxfield();
  const { preferences, setPreferences } = usePreferences();
  const { isActionInProgress } = useActionProgress();
  const searchMoxfieldApi = useSearchMoxfieldApi();

  return (
    <>
      <FloatingLabel className="mb-3" label="Bearer token">
        <Form.Control
          aria-label="Bearer token"
          type="text"
          value={sourceMoxfield.bearerToken}
          onChange={(event) => setSourceMoxfield({ bearerToken: event.currentTarget.value })}
        />
      </FloatingLabel>
      <Alert variant="primary">
        <Alert.Heading>Usage</Alert.Heading>
        <p>
          Moxfield does not currently provide a public API, so you need to extract the token from their website
          manually. Also CORS will need to be disabled so that browser does not block request from this app.
        </p>
        <p>
          To learn how to do this see readme{' '}
          <a href="https://github.com/Mutisz/mtg-booster-generator" target="_blank">
            here
          </a>
          .
        </p>
      </Alert>
      <Button
        variant={'primary'}
        disabled={sourceMoxfield.bearerToken === '' || isActionInProgress()}
        onClick={() => {
          setPreferences({ ...preferences, expansionSetCodeList: defaults.preferences.expansionSetCodeList });
          void searchMoxfieldApi();
        }}
      >
        Fetch collection
      </Button>
    </>
  );
};

export default SourceMoxfieldApiForm;
