export interface Progress {
    overall: {
        level: number;
        experience: number;
        achievements: string[];
        badges?: string[];
    };
    roadmaps: {
        totalCreated: number;
        totalCompleted: number;
        inProgress: number;
        currentRoadmaps: {
            id: string;
            title: string;
            progress: number;
            lastActivity: string;
        }[];
    };
    dsa: {
        easySolved: number;
        mediumSolved: number;
        hardSolved: number;
        streakDays: number;
        totalProblems: number;
        completedProblems: number;
        totalTimeSpent: number;
        favoriteTopics: string[];
    };
    community: {
        totalPosts: number;
        totalComments: number;
        totalLikes: number;
        totalShares: number;
        followers: number;
        following: number;
        communitiesJoined: number;
        lastActivity: string;
    };
}
