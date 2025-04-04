export interface AgentWithDocuments {
    id: string;
    name: string;
    industry: string;
    description: string;
    score: number | null;
    feedback: string | null;
    documents: {
        id: string;
        name: string;
        fileType: string;
        downloadUrl: string;
    }[];
}
