import React, { useRef, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, Loader2
} from 'lucide-react';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Compress the image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // 2. Upload to backend
      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name);

      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const url = response.data.data.url;
        // 3. Insert into editor
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Image added successfully");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Image upload failed:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const buttonClass = (isActive: boolean) => 
    `p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
      isActive ? 'bg-gray-200 dark:bg-gray-700 text-brand-500' : 'text-gray-600 dark:text-gray-400'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'))}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 mx-1 bg-gray-300 dark:bg-gray-700" />
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 mx-1 bg-gray-300 dark:bg-gray-700" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive('blockquote'))}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-6 mx-1 bg-gray-300 dark:bg-gray-700" />
      
      <button
        onClick={addImage}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 relative`}
        title="Insert Image"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
        ) : (
          <ImageIcon className="w-4 h-4" />
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      <div className="grow" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={buttonClass(false)}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={buttonClass(false)}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  className = "",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  return (
    <div className={`flex flex-col border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 overflow-hidden ${className}`}>
      <MenuBar editor={editor} />
      <div className="overflow-y-auto max-h-[600px] bg-white dark:bg-gray-900">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
