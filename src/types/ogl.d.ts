declare module 'ogl' {
  export class Renderer {
    constructor(options?: any);
    gl: WebGLRenderingContext & WebGL2RenderingContext & { canvas: HTMLCanvasElement; getExtension(name: string): any };
    setSize(width: number, height: number): void;
    render(opts: any): void;
  }
  export class Program {
    constructor(gl: WebGLRenderingContext, options: any);
  }
  export class Triangle {
    constructor(gl: WebGLRenderingContext);
  }
  export class Mesh {
    constructor(gl: WebGLRenderingContext, options: any);
  }
}
