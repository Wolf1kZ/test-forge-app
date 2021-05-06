import ForgeUI, {
  render,
  ProjectPage,
  Fragment,
  Form,
  TextField,
  Text,
  Avatar,
  Table,
  Head,
  Cell,
  Row,
  useEffect,
  useState,
  useProductContext,
} from '@forge/ui';
import api from '@forge/api';

const App = () => {
  const { accountId } = useProductContext();

  const [issues, setIssues] = useState();
  const [formState, setFormState] = useState({ jql: null });
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    const bodyData = {
      jql: formState.jql || '',
      fields: ['summary', 'status', 'assignee'],
    };

    setLoading(true);

    const response = await api.asApp().requestJira('/rest/api/3/search', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    setIssues(data.issues);
    setLoading(false);
  }, [formState]);

  const submitForm = async (formData) => {
    setFormState(formData);
  };

  return (
    <Fragment>
      <Text>You logged in as</Text>
      <Avatar accountId={accountId} />
      <Form onSubmit={submitForm} submitButtonText="Search">
        <TextField name="jql" placeholder="Input JQL for search issues" />
      </Form>
      {issues ? (
        <Table>
          <Head>
            <Cell>
              <Text>Key</Text>
            </Cell>
            <Cell>
              <Text>Summary</Text>
            </Cell>
            <Cell>
              <Text>Assignee</Text>
            </Cell>
            <Cell>
              <Text>Status</Text>
            </Cell>
          </Head>
          {issues.map((issue) => (
            <Row>
              <Cell>
                <Text>{issue.key}</Text>
              </Cell>
              <Cell>
                <Text>{issue.fields.summary || '-'}</Text>
              </Cell>
              <Cell>
                <Text>
                  {issue.fields.assignee
                    ? issue.fields.assignee.displayName
                    : 'Unassigned'}
                </Text>
              </Cell>
              <Cell>
                <Text>{issue.fields.status.name}</Text>
              </Cell>
            </Row>
          ))}
        </Table>
      ) : loading ? (
        <Text>Loading issues...</Text>
      ) : (
        <Text>No issues found</Text>
      )}
    </Fragment>
  );
};

export const run = render(
  <ProjectPage>
    <App />
  </ProjectPage>
);
