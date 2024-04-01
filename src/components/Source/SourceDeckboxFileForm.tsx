import React, { ChangeEvent } from 'react';
import Alert from 'react-bootstrap/Alert';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { useSearchDeckboxFile } from '../../hooks/useSearchDeckboxFile';
import { useSearchProgress } from '../../hooks/useSearchProgress';

const SourceDeckboxFileForm: React.FC = () => {
  const { isInProgress } = useSearchProgress();
  const searchDeckboxFile = useSearchDeckboxFile();

  return (
    <>
      <FloatingLabel className="mb-3" label="File">
        <Form.Control
          aria-label="Bearer token"
          type="file"
          accept=".csv"
          disabled={isInProgress()}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
            if (file === null) {
              throw new Error('No Deckbox file provided!');
            }

            void searchDeckboxFile(file);
          }}
        />
      </FloatingLabel>
      <Alert variant="primary">
        <Alert.Heading>Usage</Alert.Heading>
        <p>
          Deckbox does not currently provide a public API, so you need to import your collection using CSV exported from
          Deckbox. While exporting data, following fields must be selected:
        </p>
        <ul>
          <li>Type</li>
          <li>Cost</li>
          <li>Rarity</li>
          <li>Image URL</li>
        </ul>
      </Alert>
    </>
  );
};

export default SourceDeckboxFileForm;
