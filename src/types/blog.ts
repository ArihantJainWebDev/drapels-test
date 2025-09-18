export interface BlogCell {
  id: string;
  type: 'heading' | 'text' | 'image' | 'button' | 'cta';
  content: string;
  metadata?: {
    buttonText?: string;
    buttonUrl?: string;
    imageAlt?: string;
    // Text styling options
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    textColor?: string;
    textSize?: number;
    // Button gradient options
    gradientColors?: {
      color1: string;
      color2: string;
    };
    // CTA button options
    ctaShape?: 'rounded' | 'pill' | 'square' | 'hexagon' | 'diamond';
    ctaSize?: 'small' | 'medium' | 'large';
    ctaStyle?: 'solid' | 'outline' | 'gradient' | 'ghost';
    // Image styling options
    imageFit?: 'cover' | 'contain';
    imageAlignment?: 'left' | 'center' | 'right';
    imageWrap?: boolean; // when left/right, allow text to wrap around the image
    imageWidthPercent?: number; // 20-100, used when left/right
    imageHeightPx?: number; // optional fixed height in pixels for preview and render
  };
}

export interface Blog {
  id: string;
  title: string;
  cells: BlogCell[];
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
  slug: string;
  author?: string;
  authorId: string; // Firebase user ID of the author
  authorDisplayName: string; // Display name of the author
  readTime?: string;
  feedback: {
    likes: number;
    dislikes: number;
  };
}

export interface BlogFormData {
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  readTime: string;
  cells: BlogCell[];
}

export interface BlogUpdateData extends Partial<BlogFormData> {
  updatedAt?: string;
}
