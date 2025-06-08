"use client";

import toast from "react-hot-toast";
import { UploadDropzone } from "@/lib/uploadthing/component";
// import { ourFileRouter } from "../app/api/uploadthing/core";

// interface FileUploadProps {
//   onChange: (url?: string) => void;
//   endpoint: keyof typeof ourFileRouter;
// };

export const ImageUpload = ({ onChange, className }) => {
  return (
    <UploadDropzone
      className={`h-full w-full relative bg-transparent border-dashed border-white/30 gap-0 text-xs duration-200 hover:bg-white/5 cursor-pointer rounded-xl ${className}`}
      // content={{
      //   label({ isUploading, uploadProgress }) {
      //     if (isUploading) return <div>Loading...</div>;

      //     return <p className="text-xs">Upload your image</p>;
      //   },
      //   button({ isUploading, uploadProgress, ready }) {
      //     if (ready) return <div>Upload</div>;
      //     if (isUploading) return <div>{uploadProgress}%</div>;

      //     return "Upload file";
      //   },
      // }}
      // appearance={{
      //   button: "bg-primary hover:bg-primary/30 cursor-pointer button-upload relative z-[50]",
      // }}
      appearance={{
        label: "text-xs text-main_bg hover:text-main_bg/80 duration-200",
        uploadIcon: "text-main_bg hover:text-main_bg/80 duration-200",
        button: "bg-primary/80 text-main_bg shadow-md shadow-black active:outline-none focus:outline-none active:ring-0 focus:ring-0 ut-uploading:after:bg-secondary ut-uploading:text-main_bg"
      }}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log(res?.[0].url);
        onChange(res?.[0].url, res?.[0].key);
        toast.success(`Berhasil mengunggah gambar`);
      }}
      onUploadError={(error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};
