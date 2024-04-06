import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { useActionProgress } from '../../hooks/useActionProgress';
import { useSourceType } from '../../hooks/useSourceType';
import { ActionProgress, SourceType } from '../../state';
import SourceDeckboxFileForm from './SourceDeckboxFileForm';
import SourceMoxfieldApiForm from './SourceMoxfieldApiForm';

const sourceNameMap = {
  [SourceType.MoxfieldApi]: 'Moxfield API',
  [SourceType.MoxfieldFile]: 'Moxfield file',
  [SourceType.DeckboxFile]: 'Deckbox file',
};

const renderSourceForm = (sourceType: SourceType | null) => {
  if (sourceType === SourceType.MoxfieldApi) {
    return <SourceMoxfieldApiForm />;
  }
  if (sourceType === SourceType.DeckboxFile) {
    return <SourceDeckboxFileForm />;
  }

  throw new Error('Unhandled collection source!');
};

const renderProgress = (progress: ActionProgress) => {
  if (progress.progress === 0) {
    return (
      <Badge bg="warning" text="dark">
        NOT READY
      </Badge>
    );
  }
  if (progress.progress === 100) {
    return <Badge bg="success">READY</Badge>;
  }

  return <ProgressBar now={progress.progress} label={progress.action} />;
};

const SourcePanel: React.FC = () => {
  const { actionProgress, isActionInProgress } = useActionProgress();
  const { sourceType, setSourceType } = useSourceType();

  return (
    <Card style={{ minHeight: '36rem' }}>
      <Card.Header>Source</Card.Header>
      <Card.Body>
        <Form>
          <FloatingLabel className="mb-3" label="Source">
            <Form.Select
              aria-label="Source"
              disabled={isActionInProgress()}
              value={sourceType as string}
              onChange={(event) => setSourceType(event.currentTarget.value as SourceType)}
            >
              {Object.values(SourceType).map((value) => (
                <option key={value} value={value}>
                  {sourceNameMap[value]}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          {renderSourceForm(sourceType)}
        </Form>
      </Card.Body>
      <Card.Footer>{renderProgress(actionProgress)}</Card.Footer>
    </Card>
  );
};

export default SourcePanel;
