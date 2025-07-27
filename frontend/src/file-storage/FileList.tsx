import { useActor } from '../hooks/useActor';
import { canisterId, FileMetadata } from '../backend';

const network = process.env.DFX_NETWORK || (process.env.NODE_ENV === 'production' ? 'ic' : 'local');

async function loadConfig(): Promise<{
    backend_host: string;
    backend_canister_id: string;
}> {
    try {
        const response = await fetch('./env.json');
        const config = await response.json();
        return config;
    } catch {
        const fallbackConfig = {
            backend_host: 'undefined',
            backend_canister_id: 'undefined'
        };
        return fallbackConfig;
    }
}

export const useFileList = () => {
    const { actor } = useActor();

    const getFileList = async (): Promise<FileMetadata[]> => {
        if (!actor) {
            throw new Error('Backend is not available');
        }
        return await actor.listFiles();
    };

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

    const validateUrl = (path: string): boolean => {
        const validPattern = /^(?!.*\.\.)(?!\/)(?!.*\s)[a-zA-Z0-9\-_.\/]+(?<!\/)$/;
        return validPattern.test(path);
    };

    const getFileUrl = (metadata: FileMetadata): string => {
        const sanitizedPath = sanitizeUrl(metadata.path);
        validateUrl(metadata.path);

        // For now, return a placeholder URL since file storage isn't fully implemented
        // This would need to be updated when proper file storage is implemented
        return `#file-${sanitizedPath}`;
    };

    return { getFileList, getFileUrl };
};
