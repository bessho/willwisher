import { useState } from 'react';
import { useActor } from '../hooks/useActor';

export type ProgressInfo = (percentage: number) => Promise<void>;

export const useFileUpload = () => {
    const { actor } = useActor();
    const [isUploading, setIsUploading] = useState(false);

    const sanitizeUrl = (path: string): string => {
        return path
            .trim() // Remove leading/trailing whitespace first
            .replace(/\s+/g, '-') // Replace all whitespace sequences with single hyphen
            .replace(/[^a-zA-Z0-9\-_./]/g, '') // Remove invalid characters
            .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
            .replace(/\.\./g, '') // Remove path traversal attempts
            .replace(/^[-\/]+/, '') // Remove leading hyphens and slashes
            .replace(/\/+/g, '/') // Normalize multiple slashes to single slash
            .replace(/[-\/]+$/, ''); // Remove trailing hyphens and slashes
    };

    const uploadFile = async (
        path: string,
        mimeType: string,
        data: Uint8Array,
        progressInfo: ProgressInfo
    ): Promise<void> => {
        if (!actor) {
            throw new Error('Backend is not available');
        }

        setIsUploading(true);

        try {
            // Since the backend doesn't have upload functionality yet,
            // we'll simulate the upload process for now
            const sanitizedPath = sanitizeUrl(path);
            
            // Simulate progress updates
            await progressInfo(25);
            await new Promise(resolve => setTimeout(resolve, 500));
            await progressInfo(50);
            await new Promise(resolve => setTimeout(resolve, 500));
            await progressInfo(75);
            await new Promise(resolve => setTimeout(resolve, 500));
            await progressInfo(100);

            // TODO: Implement actual file upload when backend supports it
            console.log(`Would upload file: ${sanitizedPath}, type: ${mimeType}, size: ${data.length} bytes`);
            
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading };
};
