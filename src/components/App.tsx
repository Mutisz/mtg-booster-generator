import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { ErrorBoundary } from 'react-error-boundary';

import { useCardBoosterList } from '../hooks/useCardBoosterList';
import { useCredentialsSource } from '../hooks/useCredentialsSource';
import { usePreferences } from '../hooks/usePreferences';
import { defaults } from '../state';
import ErrorDismissible from './Alert/ErrorDismissible';
import BoosterPanel from './Booster/BoosterPanel';
import CredentialsPanel from './Credentials/CredentialsPanel';
import PreferencesPanel from './Preferences/PreferencesPanel';

const App: React.FC = () => {
  const { setSource } = useCredentialsSource();
  const { setPreferences } = usePreferences();
  const { resetCardBoosterList } = useCardBoosterList();

  return (
    <Container className="container-fluid">
      <Container className="my-4">
        <Row>
          <Col md={12}>
            <h2>MTG Booster Generator</h2>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h6>
              Created by{' '}
              <a href="https://github.com/Mutisz" rel="noopener noreferrer" target="_blank">
                Mutisz
              </a>
            </h6>
          </Col>
        </Row>
      </Container>
      <Container className="my-4">
        <Row>
          <Col md={6}>
            <ErrorBoundary FallbackComponent={ErrorDismissible} onReset={() => setSource(defaults.credentials.source)}>
              <CredentialsPanel />
            </ErrorBoundary>
          </Col>
          <Col md={6}>
            <ErrorBoundary FallbackComponent={ErrorDismissible} onReset={() => setPreferences(defaults.preferences)}>
              <PreferencesPanel />
            </ErrorBoundary>
          </Col>
        </Row>
      </Container>
      <Container className="my-4">
        <ErrorBoundary FallbackComponent={ErrorDismissible} onReset={() => resetCardBoosterList()}>
          <BoosterPanel />
        </ErrorBoundary>
      </Container>
    </Container>
  );
};

export default App;
