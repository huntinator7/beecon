import { RouteComponentProps } from "@reach/router";
import React from "react";

interface Props extends RouteComponentProps {}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
    // You can also log the error to an error reporting service
    window.location.pathname = "/";
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    } else {
      const { children, ...childProps } = this.props;
      const childrenWithProps = React.Children.map(
        this.props.children,
        (child) => {
          // checking isValidElement is the safe way and avoids a typescript error too
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { ...childProps });
          }
          return child;
        }
      );
      return childrenWithProps;
    }
  }
}
