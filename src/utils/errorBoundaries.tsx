import { Component, ReactNode, ErrorInfo } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo?: ErrorInfo;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  // public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container fluid="md">
          <div className="d-flex flex-column justify-content-center my-5">
            <h4>
              There was an error with this listing. <Link to="/">Click here</Link> to back to the
              home page.
            </h4>
            <br />
            <hr />
            {this.state.error && this.state.error.toString()}
            <br />
            <p>{JSON.stringify(this.state.errorInfo?.componentStack)}</p>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
