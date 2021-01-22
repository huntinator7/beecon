import { RouteComponentProps } from "@reach/router";
import React, { cloneElement, Component, isValidElement } from "react";

interface Props extends RouteComponentProps {}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error);
    console.log(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div />;
    }

    const childrenWithProps = React.Children.map(
      this.props.children,
      (child) => {
        // checking isValidElement is the safe way and avoids a typescript error too
        if (isValidElement(child)) {
          return cloneElement(child, { props: this.props });
        }
        return child;
      }
    );

    return <div>{childrenWithProps}</div>;
  }
}

export default ErrorBoundary;
