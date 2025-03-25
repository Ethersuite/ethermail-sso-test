declare namespace JSX {
  interface IntrinsicElements {
    'ethermail-login': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      widget?: string;
      type?: string;
      permissions?: string;
      label?: string;
    };
  }
}