
interface NodeModule {
  id: string;
  filename: string;
  loaded: boolean;
  isPreloading?: boolean;
  exports?: any;
  require?: any;
  parent?: NodeModule | null;
  children?: NodeModule[];
  paths?: string[];
}

interface NodeRequire {
  (id: string): any;
  resolve: (id: string) => string;
  cache: Record<string, any>;
  extensions: Record<string, any>;
  main: NodeModule;
}

interface Window {
  global: Window;
  require: NodeRequire;
  process: {
    env: Record<string, string>;
  };
  seedrandom?: any;
}
