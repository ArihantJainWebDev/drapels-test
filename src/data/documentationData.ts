export interface DocSection {
  id: string;
  title: string;
  description?: string;
  content: string;
  subsections?: DocSection[];
  codeExample?: string;
  language?: string;
  externalLinks?: { name: string; url: string; }[];
}

export interface DocCategory {
  id: string;
  title: string;
  iconName: string; // Changed from icon to iconName to use Lucide icons
  description: string;
  sections: DocSection[];
}

export const documentationData: DocCategory[] = [
  {
    id: "overview",
    title: "Overview",
    iconName: "BookOpen",
    description: "Getting started with AI tools and our platform",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        content: `Welcome to our comprehensive AI documentation hub. This platform provides detailed information about the most popular AI tools and frameworks currently available, along with complete documentation for our website's features.

Our documentation covers everything from machine learning frameworks to natural language processing tools, computer vision libraries, and much more. Whether you're a beginner or an experienced AI practitioner, you'll find valuable resources here.`,
        subsections: [
          {
            id: "what-you-can-find",
            title: "What You Can Find Here",
            content: `• Comprehensive guides for popular AI frameworks like TensorFlow, PyTorch, and scikit-learn
• Documentation for cutting-edge tools like OpenAI's APIs, Hugging Face Transformers, and more
• Complete feature documentation for our platform
• Code examples and best practices
• Integration guides and tutorials`
          },
          {
            id: "getting-started",
            title: "Getting Started",
            content: `To get the most out of this documentation:
1. Browse through the categories in the sidebar
2. Use the search functionality to find specific topics
3. Follow along with code examples
4. Check out the external links for additional resources`
          }
        ]
      }
    ]
  },
  {
    id: "ai-frameworks",
    title: "AI Frameworks",
    iconName: "Bot",
    description: "Popular machine learning and deep learning frameworks",
    sections: [
      {
        id: "tensorflow",
        title: "TensorFlow",
        description: "Google's open-source machine learning framework",
        content: `TensorFlow is an end-to-end open-source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries, and community resources that lets researchers and developers easily build and deploy ML-powered applications.

TensorFlow provides stable Python and C++ APIs, as well as non-guaranteed backward compatible API for other languages.`,
        codeExample: `import tensorflow as tf

# Create a simple neural network
model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10, activation='softmax')
])

# Compile the model
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Load and preprocess data
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

# Train the model
model.fit(x_train, y_train, epochs=5, validation_split=0.2)`,
        language: "python",
        externalLinks: [
          { name: "TensorFlow Official", url: "https://tensorflow.org" },
          { name: "TensorFlow GitHub", url: "https://github.com/tensorflow/tensorflow" },
          { name: "TensorFlow Tutorials", url: "https://tensorflow.org/tutorials" }
        ],
        subsections: [
          {
            id: "tensorflow-keras",
            title: "Keras API",
            content: `Keras is TensorFlow's high-level API for building and training deep learning models. It's user-friendly, modular, and composable.`,
            codeExample: `# Building a CNN with Keras
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])`,
            language: "python"
          },
          {
            id: "tensorflow-datasets",
            title: "TensorFlow Datasets",
            content: `TensorFlow Datasets provides a collection of ready-to-use datasets for use with TensorFlow or other Python ML frameworks.`,
            codeExample: `import tensorflow_datasets as tfds

# Load dataset
(ds_train, ds_test), ds_info = tfds.load(
    'mnist',
    split=['train', 'test'],
    shuffle_files=True,
    as_supervised=True,
    with_info=True,
)

# Preprocess data
def normalize_img(image, label):
    return tf.cast(image, tf.float32) / 255., label

ds_train = ds_train.map(normalize_img)
ds_test = ds_test.map(normalize_img)`,
            language: "python"
          }
        ]
      },
      {
        id: "pytorch",
        title: "PyTorch",
        description: "Facebook's open-source machine learning library",
        content: `PyTorch is an optimized tensor library for deep learning using GPUs and CPUs. It provides a flexible and dynamic computational graph, making it popular among researchers and developers for its ease of use and debugging capabilities.

PyTorch is known for its dynamic computation graphs, which allow for more flexible model architectures and easier debugging compared to static graph frameworks.`,
        codeExample: `import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F

# Define a simple neural network
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 10)
        self.dropout = nn.Dropout(0.2)
        
    def forward(self, x):
        x = x.view(-1, 784)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return F.log_softmax(x, dim=1)

# Create model and optimizer
model = Net()
optimizer = optim.Adam(model.parameters(), lr=0.001)`,
        language: "python",
        externalLinks: [
          { name: "PyTorch Official", url: "https://pytorch.org" },
          { name: "PyTorch GitHub", url: "https://github.com/pytorch/pytorch" },
          { name: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/" }
        ],
        subsections: [
          {
            id: "pytorch-tensors",
            title: "Tensors",
            content: `Tensors are the fundamental data structure in PyTorch, similar to NumPy arrays but with GPU support.`,
            codeExample: `import torch

# Create tensors
x = torch.randn(3, 4)  # Random tensor
y = torch.zeros(3, 4)  # Zero tensor
z = torch.ones(3, 4)   # Ones tensor

# Tensor operations
result = x + y
result = torch.matmul(x, y.T)  # Matrix multiplication

# Move to GPU (if available)
if torch.cuda.is_available():
    x = x.cuda()
    y = y.cuda()`,
            language: "python"
          },
          {
            id: "pytorch-autograd",
            title: "Automatic Differentiation",
            content: `PyTorch's autograd system provides automatic differentiation for all operations on tensors.`,
            codeExample: `import torch

# Create tensor with gradient tracking
x = torch.randn(2, 2, requires_grad=True)
y = x + 2
z = y * y * 3
out = z.mean()

# Backward pass
out.backward()

# Access gradients
print(x.grad)  # Gradients of x`,
            language: "python"
          }
        ]
      },
      {
        id: "scikit-learn",
        title: "scikit-learn",
        description: "Machine learning library for Python",
        content: `Scikit-learn is a free machine learning library for Python. It features various classification, regression, and clustering algorithms including support vector machines, random forests, gradient boosting, k-means, and DBSCAN.

Built on NumPy, SciPy, and matplotlib, scikit-learn provides simple and efficient tools for data mining and data analysis.`,
        codeExample: `from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.datasets import load_iris

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Make predictions
y_pred = clf.predict(X_test)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")
print(classification_report(y_test, y_pred))`,
        language: "python",
        externalLinks: [
          { name: "scikit-learn Official", url: "https://scikit-learn.org" },
          { name: "scikit-learn GitHub", url: "https://github.com/scikit-learn/scikit-learn" },
          { name: "User Guide", url: "https://scikit-learn.org/stable/user_guide.html" }
        ]
      }
    ]
  },
  {
    id: "ai-apis",
    title: "AI APIs & Services",
    iconName: "Globe",
    description: "Cloud-based AI services and APIs",
    sections: [
      {
        id: "openai",
        title: "OpenAI API",
        description: "Access to GPT models and other AI capabilities",
        content: `The OpenAI API provides access to OpenAI's powerful AI models, including GPT-4, GPT-3.5, DALL-E, Whisper, and more. These models can be used for text generation, image creation, speech recognition, and various other AI tasks.

The API is designed to be simple to use while providing powerful capabilities for developers to integrate AI into their applications.`,
        codeExample: `import openai
from openai import OpenAI

# Initialize the client
client = OpenAI(api_key="your-api-key")

# Chat completion with GPT-4
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    max_tokens=200,
    temperature=0.7
)

print(response.choices[0].message.content)

# Image generation with DALL-E
image_response = client.images.generate(
    model="dall-e-3",
    prompt="A futuristic cityscape at sunset",
    size="1024x1024",
    quality="standard",
    n=1
)

print(image_response.data[0].url)`,
        language: "python",
        externalLinks: [
          { name: "OpenAI API Docs", url: "https://platform.openai.com/docs" },
          { name: "OpenAI Playground", url: "https://platform.openai.com/playground" },
          { name: "OpenAI GitHub", url: "https://github.com/openai/openai-python" }
        ],
        subsections: [
          {
            id: "openai-models",
            title: "Available Models",
            content: `OpenAI offers several model families:

**Text Models:**
- GPT-4: Most capable model for complex tasks
- GPT-3.5 Turbo: Fast and efficient for most tasks
- GPT-3.5 Turbo Instruct: Instruction-following model

**Image Models:**
- DALL-E 3: Latest image generation model
- DALL-E 2: Previous generation image model

**Audio Models:**
- Whisper: Speech-to-text transcription
- TTS: Text-to-speech synthesis

**Embedding Models:**
- text-embedding-ada-002: For text similarity and search`
          },
          {
            id: "openai-best-practices",
            title: "Best Practices",
            content: `When using the OpenAI API:

1. **Prompt Engineering**: Craft clear, specific prompts
2. **Temperature Control**: Use lower values for deterministic outputs
3. **Token Management**: Monitor usage to control costs
4. **Error Handling**: Implement proper error handling for rate limits
5. **Security**: Never expose API keys in client-side code`
          }
        ]
      },
      {
        id: "huggingface",
        title: "Hugging Face",
        description: "Transformers library and model hub",
        content: `Hugging Face provides state-of-the-art machine learning models for natural language processing, computer vision, audio processing, and more. The Transformers library offers thousands of pre-trained models and easy-to-use APIs.

The Hugging Face Hub is a platform where the machine learning community collaborates on models, datasets, and applications.`,
        codeExample: `from transformers import pipeline, AutoTokenizer, AutoModel
import torch

# Using pipelines for quick tasks
classifier = pipeline("sentiment-analysis")
result = classifier("I love using AI tools!")
print(result)

# Text generation
generator = pipeline("text-generation", model="gpt2")
output = generator("The future of AI is", max_length=50, num_return_sequences=1)
print(output[0]['generated_text'])

# Question answering
qa_pipeline = pipeline("question-answering")
context = "Hugging Face is a company that provides tools for AI developers."
question = "What does Hugging Face provide?"
answer = qa_pipeline(question=question, context=context)
print(answer)

# Using specific models
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

inputs = tokenizer("Hello world!", return_tensors="pt")
outputs = model(**inputs)`,
        language: "python",
        externalLinks: [
          { name: "Hugging Face Hub", url: "https://huggingface.co" },
          { name: "Transformers Docs", url: "https://huggingface.co/docs/transformers" },
          { name: "Hugging Face GitHub", url: "https://github.com/huggingface/transformers" }
        ]
      }
    ]
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    iconName: "Eye",
    description: "Tools and libraries for image and video processing",
    sections: [
      {
        id: "opencv",
        title: "OpenCV",
        description: "Open Source Computer Vision Library",
        content: `OpenCV (Open Source Computer Vision Library) is a library of programming functions mainly aimed at real-time computer vision. It's widely used for image processing, video capture and analysis, and machine learning tasks related to computer vision.

OpenCV supports multiple programming languages including Python, C++, and Java, and can be used on various platforms including Windows, Linux, macOS, iOS, and Android.`,
        codeExample: `import cv2
import numpy as np

# Read an image
image = cv2.imread('image.jpg')

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply Gaussian blur
blurred = cv2.GaussianBlur(gray, (15, 15), 0)

# Edge detection
edges = cv2.Canny(blurred, 50, 150)

# Find contours
contours, hierarchy = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Draw contours
cv2.drawContours(image, contours, -1, (0, 255, 0), 2)

# Face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
faces = face_cascade.detectMultiScale(gray, 1.1, 4)

for (x, y, w, h) in faces:
    cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)

# Display the result
cv2.imshow('Result', image)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
        language: "python",
        externalLinks: [
          { name: "OpenCV Official", url: "https://opencv.org" },
          { name: "OpenCV Documentation", url: "https://docs.opencv.org" },
          { name: "OpenCV GitHub", url: "https://github.com/opencv/opencv" }
        ]
      },
      {
        id: "yolo",
        title: "YOLO (You Only Look Once)",
        description: "Real-time object detection system",
        content: `YOLO is a state-of-the-art, real-time object detection system. It's known for its speed and accuracy in detecting objects in images and videos. YOLO treats object detection as a regression problem, predicting bounding boxes and class probabilities directly from full images in one evaluation.

YOLOv8 is the latest version, offering improved performance and easier deployment options.`,
        codeExample: `from ultralytics import YOLO
import cv2

# Load YOLOv8 model
model = YOLO('yolov8n.pt')  # nano version for speed

# Load image
image = cv2.imread('image.jpg')

# Run inference
results = model(image)

# Process results
for r in results:
    boxes = r.boxes
    for box in boxes:
        # Get box coordinates
        x1, y1, x2, y2 = box.xyxy[0]
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        
        # Get confidence and class
        confidence = box.conf[0]
        class_id = int(box.cls[0])
        class_name = model.names[class_id]
        
        # Draw bounding box
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image, f'{class_name}: {confidence:.2f}', 
                   (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Display result
cv2.imshow('YOLO Detection', image)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
        language: "python",
        externalLinks: [
          { name: "Ultralytics YOLOv8", url: "https://ultralytics.com/yolov8" },
          { name: "YOLO GitHub", url: "https://github.com/ultralytics/ultralytics" },
          { name: "YOLO Documentation", url: "https://docs.ultralytics.com" }
        ]
      }
    ]
  },
  {
    id: "nlp-tools",
    title: "Natural Language Processing",
    iconName: "MessageSquare",
    description: "Libraries and tools for text processing and analysis",
    sections: [
      {
        id: "spacy",
        title: "spaCy",
        description: "Industrial-strength NLP library",
        content: `spaCy is a free, open-source library for advanced Natural Language Processing (NLP) in Python. It's designed specifically for production use and helps you build applications that process and understand large volumes of text.

spaCy excels at large-scale information extraction tasks and is particularly fast and efficient for processing text at scale.`,
        codeExample: `import spacy
from spacy import displacy

# Load English language model
nlp = spacy.load("en_core_web_sm")

# Process text
text = "Apple is looking at buying U.K. startup for $1 billion"
doc = nlp(text)

# Extract named entities
print("Named Entities:")
for ent in doc.ents:
    print(f"{ent.text}: {ent.label_} ({ent.start_char}-{ent.end_char})")

# Part-of-speech tagging
print("\nPart-of-speech tags:")
for token in doc:
    print(f"{token.text}: {token.pos_} ({token.lemma_})")

# Dependency parsing
print("\nDependencies:")
for token in doc:
    print(f"{token.text} -> {token.head.text} ({token.dep_})")

# Sentence segmentation
print("\nSentences:")
for sent in doc.sents:
    print(sent.text)

# Similarity (requires larger model)
# nlp = spacy.load("en_core_web_md")
# doc1 = nlp("I like cats")
# doc2 = nlp("I love dogs")
# print(f"Similarity: {doc1.similarity(doc2)}")`,
        language: "python",
        externalLinks: [
          { name: "spaCy Official", url: "https://spacy.io" },
          { name: "spaCy Documentation", url: "https://spacy.io/usage" },
          { name: "spaCy GitHub", url: "https://github.com/explosion/spaCy" }
        ]
      },
      {
        id: "nltk",
        title: "NLTK",
        description: "Natural Language Toolkit",
        content: `NLTK (Natural Language Toolkit) is a leading platform for building Python programs to work with human language data. It provides easy-to-use interfaces to over 50 corpora and lexical resources such as WordNet.

NLTK is great for education, research, and rapid prototyping of NLP applications.`,
        codeExample: `import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.tag import pos_tag
from nltk.chunk import ne_chunk

# Download required data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('maxent_ne_chunker')
nltk.download('words')

text = "Natural language processing with NLTK is powerful and educational."

# Tokenization
words = word_tokenize(text)
sentences = sent_tokenize(text)

print(f"Words: {words}")
print(f"Sentences: {sentences}")

# Remove stopwords
stop_words = set(stopwords.words('english'))
filtered_words = [w for w in words if w.lower() not in stop_words]
print(f"Filtered words: {filtered_words}")

# Stemming
stemmer = PorterStemmer()
stemmed = [stemmer.stem(w) for w in filtered_words]
print(f"Stemmed: {stemmed}")

# Lemmatization
lemmatizer = WordNetLemmatizer()
lemmatized = [lemmatizer.lemmatize(w) for w in filtered_words]
print(f"Lemmatized: {lemmatized}")

# POS tagging
pos_tags = pos_tag(words)
print(f"POS tags: {pos_tags}")

# Named entity recognition
named_entities = ne_chunk(pos_tags)
print(f"Named entities: {named_entities}")`,
        language: "python",
        externalLinks: [
          { name: "NLTK Official", url: "https://www.nltk.org" },
          { name: "NLTK Book", url: "https://www.nltk.org/book/" },
          { name: "NLTK GitHub", url: "https://github.com/nltk/nltk" }
        ]
      }
    ]
  },
  {
    id: "website-features",
    title: "Website Features",
    iconName: "Sparkles",
    description: "Complete documentation for our platform's capabilities",
    sections: [
      {
        id: "roadmap-generator",
        title: "Roadmap Generator",
        description: "AI-powered learning path creation",
        content: `Our Roadmap Generator uses advanced AI to create personalized learning paths for any skill or technology. Whether you're learning programming, data science, or any other field, our AI analyzes your current level and goals to create a structured, step-by-step roadmap.

Features:
• Personalized learning paths based on your experience level
• Interactive roadmap visualization
• Progress tracking and milestone completion
• Resource recommendations for each step
• Community feedback and ratings`,
        codeExample: `// Example API call to generate a roadmap
const generateRoadmap = async (topic, level, duration) => {
  const response = await fetch('/api/roadmap/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      topic,
      experienceLevel: level,
      targetDuration: duration,
      preferences: {
        includeProjects: true,
        difficulty: 'progressive'
      }
    })
  });
  
  const roadmap = await response.json();
  return roadmap;
};

// Usage
const roadmap = await generateRoadmap('React Development', 'beginner', '3 months');`,
        language: "javascript"
      },
      {
        id: "ai-quiz",
        title: "AI Quiz System",
        description: "Intelligent assessment and learning tool",
        content: `Our AI Quiz System provides adaptive quizzes that adjust to your knowledge level in real-time. The system uses machine learning to generate relevant questions and provide personalized feedback.

Features:
• Adaptive difficulty based on performance
• Multiple question types (MCQ, coding, scenario-based)
• Instant feedback with explanations
• Progress analytics and weak area identification
• Custom quiz creation for educators
• Integration with learning roadmaps`,
        codeExample: `// Example quiz interaction
const startQuiz = async (topic, difficulty = 'adaptive') => {
  const response = await fetch('/api/quiz/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      topic,
      difficulty,
      questionCount: 10
    })
  });
  
  return response.json();
};

// Submit answer and get next question
const submitAnswer = async (quizId, questionId, answer) => {
  const response = await fetch(\`/api/quiz/\${quizId}/answer\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      questionId,
      answer,
      timeSpent: Date.now() - questionStartTime
    })
  });
  
  return response.json();
};`,
        language: "javascript"
      },
      {
        id: "online-compiler",
        title: "Online Compiler",
        description: "Multi-language code execution environment",
        content: `Our Online Compiler supports multiple programming languages with real-time code execution, syntax highlighting, and collaborative features. Perfect for learning, prototyping, and sharing code snippets.

Supported Languages:
• Python, JavaScript, TypeScript
• Java, C++, C#
• Go, Rust, PHP
• HTML/CSS/JavaScript for web development
• SQL for database queries

Features:
• Real-time syntax highlighting and error detection
• Code sharing and collaboration
• Input/output handling
• File upload and download
• Integration with AI assistant for code help`,
        codeExample: `// Example compiler API usage
const executeCode = async (code, language, input = '') => {
  const response = await fetch('/api/compiler/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      code,
      language,
      input,
      options: {
        timeout: 30000,
        memory: '256MB'
      }
    })
  });
  
  const result = await response.json();
  return {
    output: result.output,
    error: result.error,
    executionTime: result.executionTime,
    memoryUsage: result.memoryUsage
  };
};

// Usage example
const result = await executeCode(
  'print("Hello, World!")', 
  'python'
);
console.log(result.output);`,
        language: "javascript"
      },
      {
        id: "community",
        title: "Community Features",
        description: "Social learning and collaboration platform",
        content: `Our Community platform enables users to connect, share knowledge, and collaborate on learning journeys. It includes discussion forums, project showcases, mentorship programs, and study groups.

Features:
• Discussion channels organized by topics
• Project showcase and code review
• Mentorship matching system
• Study groups and learning circles
• Event hosting and participation
• Achievement badges and reputation system
• Real-time chat and video calls`,
        codeExample: `// Example community API interactions
const createPost = async (channelId, content, attachments = []) => {
  const formData = new FormData();
  formData.append('channelId', channelId);
  formData.append('content', content);
  attachments.forEach(file => formData.append('attachments', file));
  
  const response = await fetch('/api/community/posts', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`
    },
    body: formData
  });
  
  return response.json();
};

// Join a study group
const joinStudyGroup = async (groupId) => {
  const response = await fetch(\`/api/community/groups/\${groupId}/join\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
  
  return response.json();
};`,
        language: "javascript"
      },
      {
        id: "resume-builder",
        title: "Resume Builder",
        description: "Professional resume creation with multiple templates",
        content: `Our Resume Builder helps you create professional, ATS-friendly resumes with multiple customizable templates. Whether you're a fresh graduate or an experienced professional, our tool provides industry-specific templates and AI-powered content suggestions.

Features:
• Multiple professional templates
• ATS-friendly formatting
• Real-time preview
• PDF export
• AI-powered content suggestions
• Industry-specific examples
• Skills matching and optimization`,
        codeExample: `// Example resume builder API usage
const createResume = async (resumeData, templateId) => {
  const response = await fetch('/api/resume/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      template: templateId,
      personalInfo: resumeData.personalInfo,
      experience: resumeData.experience,
      education: resumeData.education,
      skills: resumeData.skills,
      projects: resumeData.projects,
      certifications: resumeData.certifications
    })
  });
  
  return response.json();
};

// Generate PDF
const generatePDF = async (resumeId) => {
  const response = await fetch(\`/api/resume/\${resumeId}/pdf\`, {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.pdf';
  a.click();
};`,
        language: "javascript"
      },
      {
        id: "dsa-sheet",
        title: "DSA Practice Sheet",
        description: "Comprehensive data structures and algorithms practice",
        content: `Master data structures and algorithms with our comprehensive practice sheet. Track your progress through curated problems from easy to advanced levels, with detailed solutions and explanations.

Features:
• 500+ curated problems
• Difficulty-based categorization
• Progress tracking
• Detailed solutions with explanations
• Time and space complexity analysis
• Company-wise problem sets
• Topic-wise organization
• Performance analytics`,
        codeExample: `// Example DSA practice API
const getProblemSet = async (topic, difficulty) => {
  const response = await fetch('/api/dsa/problems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      topic: topic, // 'arrays', 'linked-lists', 'trees', etc.
      difficulty: difficulty, // 'easy', 'medium', 'hard'
      limit: 50
    })
  });
  
  return response.json();
};

// Submit solution
const submitSolution = async (problemId, solution, language) => {
  const response = await fetch(\`/api/dsa/problems/\${problemId}/submit\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      code: solution,
      language: language,
      testCases: true
    })
  });
  
  const result = await response.json();
  return {
    passed: result.passed,
    executionTime: result.executionTime,
    memoryUsage: result.memoryUsage,
    testCaseResults: result.testCases
  };
};`,
        language: "javascript"
      },
      {
        id: "email-generator",
        title: "Email Generator",
        description: "AI-powered professional email creation",
        content: `Generate professional emails for various purposes using AI. Whether you need to write follow-up emails, cold outreach, meeting requests, or formal communications, our AI understands context and tone to create appropriate content.

Features:
• Multiple email types (professional, casual, formal)
• Context-aware content generation
• Tone adjustment (friendly, professional, urgent)
• Template library
• Personalization options
• Multi-language support
• Grammar and style checking`,
        codeExample: `// Example email generation API
const generateEmail = async (emailType, context, tone) => {
  const response = await fetch('/api/email/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      type: emailType, // 'follow-up', 'cold-outreach', 'meeting-request'
      context: context, // Description of the situation
      tone: tone, // 'professional', 'friendly', 'formal'
      recipient: {
        name: 'John Doe',
        title: 'Software Engineer',
        company: 'TechCorp'
      },
      sender: {
        name: 'Your Name',
        title: 'Your Title',
        company: 'Your Company'
      }
    })
  });
  
  const result = await response.json();
  return {
    subject: result.subject,
    body: result.body,
    suggestions: result.improvements
  };
};

// Usage example
const email = await generateEmail(
  'follow-up',
  'Following up on job application for Senior Developer position',
  'professional'
);
console.log('Generated email:', email);`,
        language: "javascript"
      }
    ]
  },
  {
    id: "data-science",
    title: "Data Science & Analytics",
    iconName: "BarChart3",
    description: "Tools and libraries for data analysis, visualization, and machine learning",
    sections: [
      {
        id: "pandas",
        title: "Pandas",
        description: "Python data manipulation and analysis library",
        content: `Pandas is a fast, powerful, flexible and easy to use open source data analysis and manipulation tool, built on top of the Python programming language.

Pandas provides data structures and data analysis tools for Python programming language. It enables you to carry out entire data analysis workflows in Python without having to switch to a more domain specific language like R.`,
        codeExample: `import pandas as pd
import numpy as np

# Create a DataFrame
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'Age': [25, 30, 35, 28, 32],
    'Salary': [50000, 60000, 70000, 55000, 65000],
    'Department': ['IT', 'HR', 'Finance', 'IT', 'Marketing']
}

df = pd.DataFrame(data)
print(df.head())

# Basic operations
print(f"Average age: {df['Age'].mean()}")
print(f"Total salary: {df['Salary'].sum()}")

# Group by department
dept_stats = df.groupby('Department').agg({
    'Salary': ['mean', 'sum'],
    'Age': 'mean'
})
print(dept_stats)

# Filter data
it_employees = df[df['Department'] == 'IT']
print(it_employees)`,
        language: "python",
        externalLinks: [
          { name: "Pandas Official", url: "https://pandas.pydata.org" },
          { name: "Pandas Documentation", url: "https://pandas.pydata.org/docs/" },
          { name: "Pandas GitHub", url: "https://github.com/pandas-dev/pandas" }
        ]
      },
      {
        id: "numpy",
        title: "NumPy",
        description: "Fundamental package for scientific computing with Python",
        content: `NumPy is the fundamental package for scientific computing in Python. It is a Python library that provides a multidimensional array object, various derived objects, and an assortment of routines for fast operations on arrays.

NumPy forms the foundation of the Python scientific computing stack, and most other data science libraries in Python are built on top of NumPy arrays.`,
        codeExample: `import numpy as np

# Create arrays
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.array([[1, 2, 3], [4, 5, 6]])

print(f"1D Array: {arr1}")
print(f"2D Array: {arr2}")
print(f"Shape: {arr2.shape}")
print(f"Data type: {arr1.dtype}")

# Array operations
result = arr1 * 2
print(f"Multiply by 2: {result}")

# Mathematical functions
print(f"Mean: {np.mean(arr1)}")
print(f"Standard deviation: {np.std(arr1)}")
print(f"Sum: {np.sum(arr1)}")

# Array indexing and slicing
print(f"First element: {arr1[0]}")
print(f"Last two elements: {arr1[-2:]}")

# Broadcasting
broadcast_result = arr2 + arr1
print(f"Broadcasting: {broadcast_result}")`,
        language: "python",
        externalLinks: [
          { name: "NumPy Official", url: "https://numpy.org" },
          { name: "NumPy Documentation", url: "https://numpy.org/doc/" },
          { name: "NumPy GitHub", url: "https://github.com/numpy/numpy" }
        ]
      },
      {
        id: "matplotlib",
        title: "Matplotlib",
        description: "Python plotting library for creating static, animated, and interactive visualizations",
        content: `Matplotlib is a comprehensive library for creating static, animated, and interactive visualizations in Python. It provides an object-oriented API for embedding plots into applications.

Matplotlib makes easy things easy and hard things possible. You can generate plots, histograms, power spectra, bar charts, errorcharts, scatterplots, etc., with just a few lines of code.`,
        codeExample: `import matplotlib.pyplot as plt
import numpy as np

# Create sample data
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# Create a figure with subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

# Line plot
ax1.plot(x, y1, label='sin(x)', color='blue')
ax1.plot(x, y2, label='cos(x)', color='red')
ax1.set_title('Trigonometric Functions')
ax1.set_xlabel('x')
ax1.set_ylabel('y')
ax1.legend()
ax1.grid(True)

# Histogram
data = np.random.normal(0, 1, 1000)
ax2.hist(data, bins=30, alpha=0.7, color='green')
ax2.set_title('Normal Distribution')
ax2.set_xlabel('Value')
ax2.set_ylabel('Frequency')

plt.tight_layout()
plt.show()

# Scatter plot
plt.figure(figsize=(8, 6))
x_scatter = np.random.randn(100)
y_scatter = x_scatter + np.random.randn(100) * 0.5
plt.scatter(x_scatter, y_scatter, alpha=0.6)
plt.title('Scatter Plot with Correlation')
plt.xlabel('X values')
plt.ylabel('Y values')
plt.show()`,
        language: "python",
        externalLinks: [
          { name: "Matplotlib Official", url: "https://matplotlib.org" },
          { name: "Matplotlib Gallery", url: "https://matplotlib.org/stable/gallery/index.html" },
          { name: "Matplotlib GitHub", url: "https://github.com/matplotlib/matplotlib" }
        ]
      }
    ]
  },
  {
    id: "cloud-platforms",
    title: "Cloud Platforms",
    iconName: "Cloud",
    description: "Cloud computing platforms and services for AI and development",
    sections: [
      {
        id: "aws",
        title: "Amazon Web Services (AWS)",
        description: "Comprehensive cloud computing platform",
        content: `Amazon Web Services (AWS) is a comprehensive, evolving cloud computing platform provided by Amazon. AWS offers a broad set of global cloud-based products including compute, storage, databases, analytics, networking, mobile, developer tools, management tools, IoT, security, and enterprise applications.

AWS provides AI and machine learning services like SageMaker, Rekognition, Textract, and Comprehend that make it easy to build intelligent applications.`,
        codeExample: `# Example: Using AWS SDK for Python (boto3)
import boto3
from botocore.exceptions import NoCredentialsError

# Initialize AWS clients
s3 = boto3.client('s3')
ec2 = boto3.client('ec2')
sagemaker = boto3.client('sagemaker')

try:
    # List S3 buckets
    response = s3.list_buckets()
    print("S3 Buckets:")
    for bucket in response['Buckets']:
        print(f"  {bucket['Name']}")
    
    # List EC2 instances
    instances = ec2.describe_instances()
    print("\nEC2 Instances:")
    for reservation in instances['Reservations']:
        for instance in reservation['Instances']:
            print(f"  {instance['InstanceId']} - {instance['State']['Name']}")
    
    # List SageMaker endpoints
    endpoints = sagemaker.list_endpoints()
    print("\nSageMaker Endpoints:")
    for endpoint in endpoints['Endpoints']:
        print(f"  {endpoint['EndpointName']} - {endpoint['EndpointStatus']}")
        
except NoCredentialsError:
    print("AWS credentials not found. Configure with 'aws configure'")
except Exception as e:
    print(f"Error: {e}")`,
        language: "python",
        externalLinks: [
          { name: "AWS Official", url: "https://aws.amazon.com" },
          { name: "AWS Documentation", url: "https://docs.aws.amazon.com" },
          { name: "AWS SDK for Python", url: "https://boto3.amazonaws.com/v1/documentation/api/latest/index.html" }
        ]
      },
      {
        id: "gcp",
        title: "Google Cloud Platform (GCP)",
        description: "Google's comprehensive cloud computing platform",
        content: `Google Cloud Platform (GCP) is a suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products, such as Google Search, Gmail, and YouTube.

GCP offers AI and machine learning services through Google Cloud AI, including AutoML, AI Platform, Vision AI, Natural Language AI, and Translation API.`,
        codeExample: `# Example: Using Google Cloud SDK for Python
from google.cloud import storage
from google.cloud import vision
from google.cloud import translate_v2 as translate
import os

# Set up authentication (requires service account key)
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'path/to/service-account-key.json'

# Cloud Storage example
def list_buckets():
    client = storage.Client()
    buckets = client.list_buckets()
    print("Cloud Storage Buckets:")
    for bucket in buckets:
        print(f"  {bucket.name}")

# Vision API example
def detect_text(image_path):
    client = vision.ImageAnnotatorClient()
    
    with open(image_path, 'rb') as image_file:
        content = image_file.read()
    
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations
    
    print("Detected text:")
    for text in texts:
        print(f"  {text.description}")

# Translation API example
def translate_text(text, target_language='es'):
    client = translate.Client()
    
    result = client.translate(
        text,
        target_language=target_language
    )
    
    print(f"Original: {text}")
    print(f"Translation: {result['translatedText']}")

# Usage examples
if __name__ == "__main__":
    list_buckets()
    translate_text("Hello, world!", 'es')`,
        language: "python",
        externalLinks: [
          { name: "Google Cloud", url: "https://cloud.google.com" },
          { name: "GCP Documentation", url: "https://cloud.google.com/docs" },
          { name: "Google Cloud Python SDK", url: "https://googleapis.dev/python/google-cloud-core/latest/index.html" }
        ]
      }
    ]
  },
  {
    id: "web-frameworks",
    title: "Web Frameworks",
    iconName: "Code",
    description: "Popular web development frameworks and libraries",
    sections: [
      {
        id: "react",
        title: "React",
        description: "A JavaScript library for building user interfaces",
        content: `React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies.

React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.`,
        codeExample: `import React, { useState, useEffect } from 'react';

// Functional Component with Hooks
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(\`/api/users/\${userId}\`);
        if (!response.ok) throw new Error('User not found');
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={\`\${user.name}'s avatar\`} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <div className="bio">{user.bio}</div>
    </div>
  );
};

// Custom Hook
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
};

// Using the custom hook
const Counter = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default UserProfile;`,
        language: "javascript",
        externalLinks: [
          { name: "React Official", url: "https://react.dev" },
          { name: "React Documentation", url: "https://react.dev/learn" },
          { name: "React GitHub", url: "https://github.com/facebook/react" }
        ]
      },
      {
        id: "nextjs",
        title: "Next.js",
        description: "The React framework for production",
        content: `Next.js is a React framework that gives you building blocks to create web applications. By framework, we mean Next.js handles the tooling and configuration needed for React, and provides additional structure, features, and optimizations for your application.

Next.js provides features like server-side rendering, static site generation, API routes, and automatic code splitting out of the box.`,
        codeExample: `// pages/api/users/[id].js - API Route
export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const user = await getUserById(id);
        res.status(200).json(user);
      } catch (error) {
        res.status(404).json({ message: 'User not found' });
      }
      break;
    
    case 'PUT':
      try {
        const updatedUser = await updateUser(id, req.body);
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(400).json({ message: 'Update failed' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(\`Method \${method} Not Allowed\`);
  }
}

// pages/users/[id].js - Dynamic Route with SSR
import { GetServerSideProps } from 'next';

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}

interface Props {
  user: User;
}

const UserPage: React.FC<Props> = ({ user }) => {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.bio}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
  
  try {
    const user = await fetchUser(id as string);
    return {
      props: {
        user,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default UserPage;`,
        language: "javascript",
        externalLinks: [
          { name: "Next.js Official", url: "https://nextjs.org" },
          { name: "Next.js Documentation", url: "https://nextjs.org/docs" },
          { name: "Next.js GitHub", url: "https://github.com/vercel/next.js" }
        ]
      },
      {
        id: "vue",
        title: "Vue.js",
        description: "The progressive JavaScript framework",
        content: `Vue.js is an open-source model–view–viewmodel front end JavaScript framework for building user interfaces and single-page applications. It was created by Evan You, and is maintained by him and the rest of the active core team members.

Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects.`,
        codeExample: `<!-- Vue 3 Composition API -->
<template>
  <div class="todo-app">
    <h1>Todo List</h1>
    <form @submit.prevent="addTodo">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Add new todo..."
        required
      />
      <button type="submit">Add</button>
    </form>
    
    <ul>
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input
          type="checkbox"
          v-model="todo.completed"
        />
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)">Delete</button>
      </li>
    </ul>
    
    <div class="filters">
      <button
        v-for="filter in filters"
        :key="filter"
        :class="{ active: currentFilter === filter }"
        @click="currentFilter = filter"
      >
        {{ filter }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const todos = ref([]);
const newTodo = ref('');
const currentFilter = ref('All');
const filters = ['All', 'Active', 'Completed'];

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      completed: false
    });
    newTodo.value = '';
  }
};

const removeTodo = (id) => {
  todos.value = todos.value.filter(todo => todo.id !== id);
};

const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'Active':
      return todos.value.filter(todo => !todo.completed);
    case 'Completed':
      return todos.value.filter(todo => todo.completed);
    default:
      return todos.value;
  }
});

onMounted(() => {
  // Load todos from localStorage
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    todos.value = JSON.parse(savedTodos);
  }
});

// Watch for changes and save to localStorage
watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos));
}, { deep: true });
</script>`,
        language: "javascript",
        externalLinks: [
          { name: "Vue.js Official", url: "https://vuejs.org" },
          { name: "Vue.js Documentation", url: "https://vuejs.org/guide/" },
          { name: "Vue.js GitHub", url: "https://github.com/vuejs/vue" }
        ]
      }
    ]
  },
  {
    id: "databases",
    title: "Databases",
    iconName: "Database",
    description: "Database systems and data storage solutions",
    sections: [
      {
        id: "mongodb",
        title: "MongoDB",
        description: "NoSQL document database",
        content: `MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

MongoDB is developed by MongoDB Inc. and licensed under the Server Side Public License. It's designed for ease of development and scaling.`,
        codeExample: `// MongoDB with Node.js and Mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp');

// Define Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

// Add methods to schema
userSchema.methods.getFullName = function() {
  return this.name;
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Create Model
const User = mongoose.model('User', userSchema);

// CRUD Operations
async function createUser(userData) {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error(\`Error creating user: \${error.message}\`);
  }
}

async function getUsers(filter = {}) {
  try {
    const users = await User.find(filter)
      .populate('posts')
      .sort({ createdAt: -1 })
      .limit(10);
    return users;
  } catch (error) {
    throw new Error(\`Error fetching users: \${error.message}\`);
  }
}

async function updateUser(id, updates) {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    return user;
  } catch (error) {
    throw new Error(\`Error updating user: \${error.message}\`);
  }
}

// Aggregation Pipeline
async function getUserStats() {
  const stats = await User.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        avgAge: { $avg: '$age' },
        oldestUser: { $max: '$age' },
        youngestUser: { $min: '$age' }
      }
    }
  ]);
  return stats[0];
}`,
        language: "javascript",
        externalLinks: [
          { name: "MongoDB Official", url: "https://www.mongodb.com" },
          { name: "MongoDB Documentation", url: "https://docs.mongodb.com" },
          { name: "Mongoose ODM", url: "https://mongoosejs.com" }
        ]
      },
      {
        id: "postgresql",
        title: "PostgreSQL",
        description: "Advanced open source relational database",
        content: `PostgreSQL is a free and open-source relational database management system emphasizing extensibility and SQL compliance. It was originally named POSTGRES, referring to its origins as a successor to the Ingres database developed at the University of California, Berkeley.

PostgreSQL features transactions with Atomicity, Consistency, Isolation, Durability properties, automatically updatable views, materialized views, triggers, foreign keys, and stored procedures.`,
        codeExample: `-- PostgreSQL Examples

-- Create Tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tags TEXT[],
    metadata JSONB
);

-- Create Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_metadata ON posts USING GIN(metadata);

-- Complex Queries
-- Get user with their post count
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(p.id) as post_count,
    MAX(p.created_at) as last_post_date
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.is_active = true
GROUP BY u.id, u.username, u.email
HAVING COUNT(p.id) > 0
ORDER BY post_count DESC
LIMIT 10;

-- Full-text search
SELECT 
    p.id,
    p.title,
    p.content,
    ts_rank(to_tsvector('english', p.title || ' ' || p.content), 
            plainto_tsquery('english', 'search term')) as rank
FROM posts p
WHERE to_tsvector('english', p.title || ' ' || p.content) 
      @@ plainto_tsquery('english', 'search term')
ORDER BY rank DESC;

-- Window Functions
SELECT 
    username,
    created_at,
    ROW_NUMBER() OVER (ORDER BY created_at) as user_number,
    LAG(created_at) OVER (ORDER BY created_at) as prev_user_date,
    LEAD(created_at) OVER (ORDER BY created_at) as next_user_date
FROM users
WHERE is_active = true;

-- Common Table Expressions (CTE)
WITH monthly_stats AS (
    SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as post_count,
        COUNT(DISTINCT user_id) as unique_users
    FROM posts
    WHERE created_at >= NOW() - INTERVAL '1 year'
    GROUP BY DATE_TRUNC('month', created_at)
)
SELECT 
    month,
    post_count,
    unique_users,
    LAG(post_count) OVER (ORDER BY month) as prev_month_posts,
    ROUND(
        ((post_count::float / LAG(post_count) OVER (ORDER BY month)) - 1) * 100, 
        2
    ) as growth_rate
FROM monthly_stats
ORDER BY month;`,
        language: "sql",
        externalLinks: [
          { name: "PostgreSQL Official", url: "https://www.postgresql.org" },
          { name: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/" },
          { name: "PostgreSQL GitHub", url: "https://github.com/postgres/postgres" }
        ]
      }
    ]
  },
  {
    id: "devops-tools",
    title: "DevOps & Deployment",
    iconName: "Truck",
    description: "Tools for development operations, deployment, and infrastructure",
    sections: [
      {
        id: "docker",
        title: "Docker",
        description: "Containerization platform",
        content: `Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers. Containers are isolated from one another and bundle their own software, libraries and configuration files.

Docker provides the ability to package and run an application in a loosely isolated environment called a container. The isolation and security allow you to run many containers simultaneously on a given host.`,
        codeExample: `# Dockerfile example
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/var/log/nginx
    depends_on:
      - api
      - database
    networks:
      - app-network

  api:
    build: ./api
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:password@database:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      database:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - app-network

  database:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - app-network

  cache:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge

# Docker commands
# Build image
# docker build -t myapp .

# Run container
# docker run -d -p 3000:80 --name myapp-container myapp

# Run with docker-compose
# docker-compose up -d

# View logs
# docker-compose logs -f web

# Scale services
# docker-compose up -d --scale api=3`,
        language: "dockerfile",
        externalLinks: [
          { name: "Docker Official", url: "https://www.docker.com" },
          { name: "Docker Documentation", url: "https://docs.docker.com" },
          { name: "Docker Hub", url: "https://hub.docker.com" }
        ]
      },
      {
        id: "kubernetes",
        title: "Kubernetes",
        description: "Container orchestration platform",
        content: `Kubernetes, also known as K8s, is an open-source system for automating deployment, scaling, and management of containerized applications. It groups containers that make up an application into logical units for easy management and discovery.

Kubernetes provides you with a framework to run distributed systems resiliently. It takes care of scaling and failover for your application, provides deployment patterns, and more.`,
        codeExample: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80

---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
data:
  app.properties: |
    debug=false
    log.level=info
    cache.ttl=3600
  nginx.conf: |
    server {
        listen 80;
        server_name localhost;
        location / {
            proxy_pass http://myapp-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }

---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
type: Opaque
data:
  database-url: cG9zdGdyZXNxbDovL3VzZXI6cGFzc3dvcmRAbG9jYWxob3N0OjU0MzIvbXlhcHA=
  api-key: bXlfc2VjcmV0X2FwaV9rZXk=

# kubectl commands
# Apply configurations
# kubectl apply -f deployment.yaml
# kubectl apply -f service.yaml
# kubectl apply -f ingress.yaml

# Check status
# kubectl get pods
# kubectl get services
# kubectl describe deployment myapp-deployment

# View logs
# kubectl logs -f deployment/myapp-deployment

# Scale deployment
# kubectl scale deployment myapp-deployment --replicas=5

# Rolling update
# kubectl set image deployment/myapp-deployment myapp=myapp:v2

# Port forward for local testing
# kubectl port-forward service/myapp-service 8080:80`,
        language: "yaml",
        externalLinks: [
          { name: "Kubernetes Official", url: "https://kubernetes.io" },
          { name: "Kubernetes Documentation", url: "https://kubernetes.io/docs/" },
          { name: "Kubernetes GitHub", url: "https://github.com/kubernetes/kubernetes" }
        ]
      }
    ]
  },
  {
    id: "mobile-development",
    title: "Mobile Development",
    iconName: "Smartphone",
    description: "Mobile app development frameworks and tools",
    sections: [
      {
        id: "react-native",
        title: "React Native",
        description: "Build native mobile apps using React",
        content: `React Native combines the best parts of native development with React, a best-in-class JavaScript library for building user interfaces. Use React Native today to create apps for Android and iOS using one codebase.

React Native apps are real mobile apps, not web apps. With React Native, you don't build a "mobile web app", an "HTML5 app", or a "hybrid app". You build a real mobile app that's indistinguishable from an app built using Objective-C, Java, or Swift.`,
        codeExample: `import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const saveTodos = async (newTodos) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      Alert.alert('Error', 'Failed to save todos');
    }
  };

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      setInputText('');
    }
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTodos = todos.filter(todo => todo.id !== id);
            setTodos(updatedTodos);
            saveTodos(updatedTodos);
          }
        }
      ]
    );
  };

  const renderTodo = ({ item }) => (
    <TouchableOpacity
      style={[styles.todoItem, item.completed && styles.completedTodo]}
      onPress={() => toggleTodo(item.id)}
      onLongPress={() => deleteTodo(item.id)}
    >
      <Text style={[styles.todoText, item.completed && styles.completedText]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Todos</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a new todo..."
          returnKeyType="done"
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    marginRight: 10
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center'
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  list: {
    flex: 1
  },
  todoItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff'
  },
  completedTodo: {
    opacity: 0.7,
    borderLeftColor: '#28a745'
  },
  todoText: {
    fontSize: 16,
    color: '#333'
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d'
  }
});

export default TodoApp;`,
        language: "javascript",
        externalLinks: [
          { name: "React Native Official", url: "https://reactnative.dev" },
          { name: "React Native Documentation", url: "https://reactnative.dev/docs/getting-started" },
          { name: "React Native GitHub", url: "https://github.com/facebook/react-native" }
        ]
      },
      {
        id: "flutter",
        title: "Flutter",
        description: "Google's UI toolkit for building natively compiled applications",
        content: `Flutter is Google's portable UI toolkit for crafting beautiful, natively compiled applications for mobile, web, and desktop from a single codebase. Flutter works with existing code, is used by developers and organizations around the world, and is free and open source.

Flutter's hot reload helps you quickly and easily experiment, build UIs, add features, and fix bugs faster. Experience sub-second reload times without losing state on emulators, simulators, and hardware.`,
        codeExample: `import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Todo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: TodoList(title: 'Flutter Todo List'),
    );
  }
}

class Todo {
  String id;
  String title;
  bool completed;
  DateTime createdAt;

  Todo({
    required this.id,
    required this.title,
    this.completed = false,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'completed': completed,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      id: json['id'],
      title: json['title'],
      completed: json['completed'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class TodoList extends StatefulWidget {
  TodoList({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  _TodoListState createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  List<Todo> _todos = [];
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadTodos();
  }

  _loadTodos() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? todosString = prefs.getString('todos');
    if (todosString != null) {
      List<dynamic> todosJson = json.decode(todosString);
      setState(() {
        _todos = todosJson.map((todo) => Todo.fromJson(todo)).toList();
      });
    }
  }

  _saveTodos() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String todosString = json.encode(_todos.map((todo) => todo.toJson()).toList());
    await prefs.setString('todos', todosString);
  }

  _addTodo() {
    if (_controller.text.isNotEmpty) {
      setState(() {
        _todos.add(Todo(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          title: _controller.text,
          createdAt: DateTime.now(),
        ));
      });
      _controller.clear();
      _saveTodos();
    }
  }

  _toggleTodo(int index) {
    setState(() {
      _todos[index].completed = !_todos[index].completed;
    });
    _saveTodos();
  }

  _deleteTodo(int index) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Delete Todo'),
          content: Text('Are you sure you want to delete this todo?'),
          actions: [
            TextButton(
              child: Text('Cancel'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: Text('Delete'),
              onPressed: () {
                setState(() {
                  _todos.removeAt(index);
                });
                _saveTodos();
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        elevation: 0,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Add a new todo...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    onSubmitted: (_) => _addTodo(),
                  ),
                ),
                SizedBox(width: 16),
                ElevatedButton(
                  onPressed: _addTodo,
                  child: Text('Add'),
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _todos.length,
              itemBuilder: (context, index) {
                final todo = _todos[index];
                return Card(
                  margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: ListTile(
                    leading: Checkbox(
                      value: todo.completed,
                      onChanged: (_) => _toggleTodo(index),
                    ),
                    title: Text(
                      todo.title,
                      style: TextStyle(
                        decoration: todo.completed
                            ? TextDecoration.lineThrough
                            : null,
                        color: todo.completed
                            ? Colors.grey
                            : null,
                      ),
                    ),
                    trailing: IconButton(
                      icon: Icon(Icons.delete),
                      onPressed: () => _deleteTodo(index),
                    ),
                    onTap: () => _toggleTodo(index),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}`,
        language: "dart",
        externalLinks: [
          { name: "Flutter Official", url: "https://flutter.dev" },
          { name: "Flutter Documentation", url: "https://docs.flutter.dev" },
          { name: "Flutter GitHub", url: "https://github.com/flutter/flutter" }
        ]
      }
    ]
  },
  {
    id: "testing",
    title: "Testing Frameworks",
    iconName: "TestTube",
    description: "Testing tools and frameworks for quality assurance",
    sections: [
      {
        id: "jest",
        title: "Jest",
        description: "JavaScript testing framework",
        content: `Jest is a delightful JavaScript testing framework with a focus on simplicity. It works out of the box for most JavaScript projects and provides features like snapshot testing, built-in mocking, and code coverage reports without additional setup.

Jest is used by Facebook to test all JavaScript code including React applications. One of Jest's philosophies is to provide an integrated "zero-configuration" experience.`,
        codeExample: `// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

// math.test.js
import { add, subtract, multiply, divide } from './math';

describe('Math operations', () => {
  test('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('should subtract two numbers correctly', () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(1, 1)).toBe(0);
    expect(subtract(0, 5)).toBe(-5);
  });

  test('should multiply two numbers correctly', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 100)).toBe(0);
  });

  test('should divide two numbers correctly', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(9, 3)).toBe(3);
    expect(divide(-10, 2)).toBe(-5);
  });

  test('should throw error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });
});

// React component testing
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from './UserProfile';

// Mock API call
jest.mock('./api', () => ({
  fetchUser: jest.fn()
}));

import { fetchUser } from './api';

describe('UserProfile Component', () => {
  beforeEach(() => {
    fetchUser.mockClear();
  });

  test('renders loading state initially', () => {
    fetchUser.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<UserProfile userId="123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders user data after successful fetch', async () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar.jpg'
    };

    fetchUser.mockResolvedValue(mockUser);
    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  test('renders error state when fetch fails', async () => {
    fetchUser.mockRejectedValue(new Error('User not found'));
    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Error: User not found')).toBeInTheDocument();
    });
  });

  test('handles user interaction', async () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar.jpg'
    };

    fetchUser.mockResolvedValue(mockUser);
    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Test button click
    const button = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(button);

    expect(fetchUser).toHaveBeenCalledTimes(2);
  });

  test('matches snapshot', () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar.jpg'
    };

    fetchUser.mockResolvedValue(mockUser);
    const { container } = render(<UserProfile userId="123" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

// Setup and teardown
describe('Database operations', () => {
  let database;

  beforeAll(async () => {
    // Setup before all tests
    database = await setupTestDatabase();
  });

  afterAll(async () => {
    // Cleanup after all tests
    await cleanupTestDatabase(database);
  });

  beforeEach(async () => {
    // Setup before each test
    await database.clear();
    await database.seed(testData);
  });

  afterEach(async () => {
    // Cleanup after each test
    await database.rollback();
  });

  test('should create user', async () => {
    const user = await database.users.create({
      name: 'Test User',
      email: 'test@example.com'
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });
});`,
        language: "javascript",
        externalLinks: [
          { name: "Jest Official", url: "https://jestjs.io" },
          { name: "Jest Documentation", url: "https://jestjs.io/docs/getting-started" },
          { name: "Jest GitHub", url: "https://github.com/facebook/jest" }
        ]
      }
    ]
  },
  {
    id: "security",
    title: "Security & Authentication",
    iconName: "Shield",
    description: "Security tools, authentication, and best practices",
    sections: [
      {
        id: "jwt",
        title: "JSON Web Tokens (JWT)",
        description: "Secure token-based authentication",
        content: `JSON Web Token (JWT) is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA. Although JWTs can be encrypted to also provide secrecy between parties, we will focus on signed tokens.`,
        codeExample: `// JWT implementation with Node.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(64).toString('hex');

// Token generation
class AuthService {
  static generateTokens(payload) {
    const accessToken = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      payload,
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

// Middleware for protecting routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      code: 'MISSING_TOKEN' 
    });
  }

  try {
    const decoded = AuthService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN' 
    });
  }
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await AuthService.verifyPassword(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate tokens
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const { accessToken, refreshToken } = AuthService.generateTokens(payload);

    // Store refresh token in database (optional)
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token refresh endpoint
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = AuthService.verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(403).json({
        error: 'Invalid or expired refresh token'
      });
    }

    // Generate new access token
    const payload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    const { accessToken } = AuthService.generateTokens(payload);

    res.json({ accessToken });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Remove refresh token from database
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Clear cookie
    res.clearCookie('refreshToken');

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});`,
        language: "javascript",
        externalLinks: [
          { name: "JWT.io", url: "https://jwt.io" },
          { name: "JWT RFC", url: "https://tools.ietf.org/html/rfc7519" },
          { name: "OWASP JWT Security", url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" }
        ]
      }
    ]
  },
  {
    id: "api-reference",
    title: "API Reference",
    iconName: "Settings",
    description: "Complete API documentation for developers",
    sections: [
      {
        id: "authentication",
        title: "Authentication",
        description: "API authentication methods",
        content: `Our API uses JWT (JSON Web Tokens) for authentication. You can authenticate using email/password or third-party providers like Google and GitHub.

## Authentication Flow
1. Register or login to get an access token
2. Include the token in the Authorization header
3. Refresh tokens when they expire

## Token Types
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (30 days), used to get new access tokens`,
        codeExample: `// Login to get tokens
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const { accessToken, refreshToken, user } = await response.json();
  
  // Store tokens securely
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  
  return { accessToken, refreshToken, user };
};

// Refresh access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });
  
  const { accessToken } = await response.json();
  localStorage.setItem('accessToken', accessToken);
  
  return accessToken;
};

// API request with authentication
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (response.status === 401) {
    // Token expired, refresh it
    const newToken = await refreshAccessToken();
    return fetch(url, {
      ...options,
      headers: {
        'Authorization': \`Bearer \${newToken}\`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }
  
  return response;
};`,
        language: "javascript"
      },
      {
        id: "rate-limits",
        title: "Rate Limits",
        description: "API usage limits and best practices",
        content: `Our API implements rate limiting to ensure fair usage and maintain service quality. Different endpoints have different limits based on their computational requirements.

## Rate Limit Headers
Every API response includes these headers:
- \`X-RateLimit-Limit\`: Maximum requests allowed
- \`X-RateLimit-Remaining\`: Requests remaining in current window
- \`X-RateLimit-Reset\`: Time when rate limit resets

## Default Limits
- **General API**: 1000 requests per hour
- **AI Generation**: 100 requests per hour
- **File Uploads**: 50 requests per hour
- **Compiler**: 200 executions per hour

## Best Practices
1. Implement exponential backoff for retries
2. Cache responses when possible
3. Use batch endpoints for multiple operations
4. Monitor rate limit headers`,
        codeExample: `// Rate limit aware API wrapper
class APIClient {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
    this.rateLimitRemaining = null;
    this.rateLimitReset = null;
  }
  
  async request(endpoint, options = {}) {
    // Check if we're rate limited
    if (this.rateLimitRemaining === 0) {
      const resetTime = new Date(this.rateLimitReset * 1000);
      const waitTime = resetTime.getTime() - Date.now();
      
      if (waitTime > 0) {
        console.log(\`Rate limited. Waiting \${waitTime}ms\`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      ...options,
      headers: {
        'Authorization': \`Bearer \${this.token}\`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    // Update rate limit info
    this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining'));
    this.rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset'));
    
    if (response.status === 429) {
      // Rate limited - implement exponential backoff
      const retryAfter = response.headers.get('Retry-After') || 60;
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return this.request(endpoint, options);
    }
    
    return response;
  }
}

// Usage
const client = new APIClient('https://api.example.com', 'your-token');
const response = await client.request('/api/roadmap/generate', {
  method: 'POST',
  body: JSON.stringify({ topic: 'React' })
});`,
        language: "javascript"
      }
    ]
  }
];
