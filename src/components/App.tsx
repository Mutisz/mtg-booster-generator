import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { ErrorBoundary } from 'react-error-boundary';

import { useBoosterList } from '../hooks/useBoosterList';
import { usePreferences } from '../hooks/usePreferences';
import { useSourceType } from '../hooks/useSourceType';
import { defaults } from '../state';
import ErrorDismissible from './Alert/ErrorDismissible';
import BoosterPanel from './Booster/BoosterPanel';
import PreferencesPanel from './Preferences/PreferencesPanel';
import SourcePanel from './Source/SourcePanel';

const App: React.FC = () => {
  const { setSourceType } = useSourceType();
  const { setPreferences } = usePreferences();
  const { resetBoosterList } = useBoosterList();

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
        <Row className="gy-4">
          <Col md={6}>
            <ErrorBoundary FallbackComponent={ErrorDismissible} onReset={() => setSourceType(defaults.source.type)}>
              <SourcePanel />
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
        <ErrorBoundary FallbackComponent={ErrorDismissible} onReset={() => resetBoosterList()}>
          <BoosterPanel />
        </ErrorBoundary>
      </Container>
    </Container>
  );
};

export default App;
