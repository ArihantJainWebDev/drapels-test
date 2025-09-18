import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  EnhancedCompanyProfile, 
  CompanyRole, 
  InterviewExperience, 
  InsiderTip, 
  RoleRoadmap, 
  JobApplication, 
  JobAlert 
} from '../types/companyInsights';

class CompanyInsightsService {
  // Company Profile Management
  async getCompanyProfiles(): Promise<EnhancedCompanyProfile[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'companyInsights'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
      })) as EnhancedCompanyProfile[];
    } catch (error) {
      console.error('Error fetching company profiles:', error);
      throw error;
    }
  }

  async getCompanyProfile(companyId: string): Promise<EnhancedCompanyProfile | null> {
    try {
      const docRef = doc(db, 'companyInsights', companyId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          lastUpdated: docSnap.data().lastUpdated?.toDate() || new Date(),
        } as EnhancedCompanyProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }
  }

  // Role Management
  async getCompanyRoles(companyId: string): Promise<CompanyRole[]> {
    try {
      const q = query(
        collection(db, 'companyRoles'),
        where('companyId', '==', companyId),
        where('isActive', '==', true),
        orderBy('postedDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        postedDate: doc.data().postedDate?.toDate(),
        applicationDeadline: doc.data().applicationDeadline?.toDate(),
      })) as CompanyRole[];
    } catch (error) {
      console.error('Error fetching company roles:', error);
      throw error;
    }
  }

  async searchRoles(filters: {
    companies?: string[];
    skills?: string[];
    experience?: string;
    location?: string;
    remote?: boolean;
  }): Promise<CompanyRole[]> {
    try {
      let q = query(collection(db, 'companyRoles'), where('isActive', '==', true));

      if (filters.companies && filters.companies.length > 0) {
        q = query(q, where('companyId', 'in', filters.companies));
      }

      if (filters.remote !== undefined) {
        q = query(q, where('remote', '==', filters.remote));
      }

      q = query(q, orderBy('postedDate', 'desc'), limit(50));

      const querySnapshot = await getDocs(q);
      let roles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        postedDate: doc.data().postedDate?.toDate(),
        applicationDeadline: doc.data().applicationDeadline?.toDate(),
      })) as CompanyRole[];

      // Client-side filtering for complex queries
      if (filters.skills && filters.skills.length > 0) {
        roles = roles.filter(role => 
          filters.skills!.some(skill => 
            role.skills.some(roleSkill => 
              roleSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }

      if (filters.location) {
        roles = roles.filter(role => 
          role.location?.some(loc => 
            loc.toLowerCase().includes(filters.location!.toLowerCase())
          )
        );
      }

      return roles;
    } catch (error) {
      console.error('Error searching roles:', error);
      throw error;
    }
  }

  // Interview Experiences
  async getInterviewExperiences(companyId: string): Promise<InterviewExperience[]> {
    try {
      const q = query(
        collection(db, 'interviewExperiences'),
        where('companyId', '==', companyId),
        orderBy('date', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as InterviewExperience[];
    } catch (error) {
      console.error('Error fetching interview experiences:', error);
      throw error;
    }
  }

  async addInterviewExperience(experience: Omit<InterviewExperience, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'interviewExperiences'), {
        ...experience,
        date: Timestamp.fromDate(experience.date),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding interview experience:', error);
      throw error;
    }
  }

  // Insider Tips
  async getInsiderTips(companyId: string): Promise<InsiderTip[]> {
    try {
      const q = query(
        collection(db, 'insiderTips'),
        where('companyId', '==', companyId),
        orderBy('upvotes', 'desc'),
        limit(30)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as InsiderTip[];
    } catch (error) {
      console.error('Error fetching insider tips:', error);
      throw error;
    }
  }

  async addInsiderTip(tip: Omit<InsiderTip, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'insiderTips'), {
        ...tip,
        date: Timestamp.fromDate(tip.date),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding insider tip:', error);
      throw error;
    }
  }

  async voteInsiderTip(tipId: string, isUpvote: boolean): Promise<void> {
    try {
      const tipRef = doc(db, 'insiderTips', tipId);
      const tipDoc = await getDoc(tipRef);
      
      if (tipDoc.exists()) {
        const currentData = tipDoc.data();
        const updateData = isUpvote 
          ? { upvotes: (currentData.upvotes || 0) + 1 }
          : { downvotes: (currentData.downvotes || 0) + 1 };
        
        await updateDoc(tipRef, updateData);
      }
    } catch (error) {
      console.error('Error voting on insider tip:', error);
      throw error;
    }
  }

  // Role Roadmaps
  async getRoleRoadmaps(companyId: string, roleId?: string): Promise<RoleRoadmap[]> {
    try {
      let q = query(
        collection(db, 'roleRoadmaps'),
        where('companyId', '==', companyId),
        orderBy('lastUpdated', 'desc')
      );

      if (roleId) {
        q = query(q, where('roleId', '==', roleId));
      }

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
      })) as RoleRoadmap[];
    } catch (error) {
      console.error('Error fetching role roadmaps:', error);
      throw error;
    }
  }

  async generateRoleRoadmap(companyId: string, roleId: string, userId: string): Promise<RoleRoadmap> {
    // This would typically call an AI service to generate a personalized roadmap
    // For now, we'll create a basic template
    const roadmap: Omit<RoleRoadmap, 'id'> = {
      roleId,
      companyId,
      title: `Roadmap for Role`,
      description: 'AI-generated learning path tailored for this specific role',
      estimatedDuration: '3-6 months',
      difficulty: 'Intermediate',
      prerequisites: [],
      learningPath: [],
      resources: [],
      milestones: [],
      createdBy: userId,
      lastUpdated: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, 'roleRoadmaps'), {
        ...roadmap,
        lastUpdated: Timestamp.fromDate(roadmap.lastUpdated),
      });
      
      return {
        id: docRef.id,
        ...roadmap,
      };
    } catch (error) {
      console.error('Error generating role roadmap:', error);
      throw error;
    }
  }

  // Job Application Tracking
  async getUserApplications(userId: string): Promise<JobApplication[]> {
    try {
      const q = query(
        collection(db, 'jobApplications'),
        where('userId', '==', userId),
        orderBy('lastUpdated', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appliedDate: doc.data().appliedDate?.toDate() || new Date(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
        interviewDates: doc.data().interviewDates?.map((date: any) => date.toDate()) || [],
        followUpReminders: doc.data().followUpReminders?.map((date: any) => date.toDate()) || [],
        timeline: doc.data().timeline?.map((event: any) => ({
          ...event,
          date: event.date?.toDate() || new Date(),
        })) || [],
      })) as JobApplication[];
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }
  }

  async addJobApplication(application: Omit<JobApplication, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'jobApplications'), {
        ...application,
        appliedDate: Timestamp.fromDate(application.appliedDate),
        lastUpdated: Timestamp.fromDate(application.lastUpdated),
        interviewDates: application.interviewDates.map(date => Timestamp.fromDate(date)),
        followUpReminders: application.followUpReminders.map(date => Timestamp.fromDate(date)),
        timeline: application.timeline.map(event => ({
          ...event,
          date: Timestamp.fromDate(event.date),
        })),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding job application:', error);
      throw error;
    }
  }

  async updateJobApplicationStatus(
    applicationId: string, 
    status: JobApplication['status'], 
    notes?: string
  ): Promise<void> {
    try {
      const applicationRef = doc(db, 'jobApplications', applicationId);
      const updateData: any = {
        status,
        lastUpdated: Timestamp.fromDate(new Date()),
      };

      if (notes) {
        updateData.notes = notes;
      }

      await updateDoc(applicationRef, updateData);
    } catch (error) {
      console.error('Error updating job application status:', error);
      throw error;
    }
  }

  // Job Alerts
  async getUserJobAlerts(userId: string): Promise<JobAlert[]> {
    try {
      const q = query(
        collection(db, 'jobAlerts'),
        where('userId', '==', userId),
        orderBy('createdDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdDate: doc.data().createdDate?.toDate() || new Date(),
        lastNotified: doc.data().lastNotified?.toDate(),
      })) as JobAlert[];
    } catch (error) {
      console.error('Error fetching job alerts:', error);
      throw error;
    }
  }

  async createJobAlert(alert: Omit<JobAlert, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'jobAlerts'), {
        ...alert,
        createdDate: Timestamp.fromDate(alert.createdDate),
        lastNotified: alert.lastNotified ? Timestamp.fromDate(alert.lastNotified) : null,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating job alert:', error);
      throw error;
    }
  }

  async updateJobAlert(alertId: string, updates: Partial<JobAlert>): Promise<void> {
    try {
      const alertRef = doc(db, 'jobAlerts', alertId);
      const updateData: any = { ...updates };

      if (updates.lastNotified) {
        updateData.lastNotified = Timestamp.fromDate(updates.lastNotified);
      }

      await updateDoc(alertRef, updateData);
    } catch (error) {
      console.error('Error updating job alert:', error);
      throw error;
    }
  }

  async deleteJobAlert(alertId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'jobAlerts', alertId));
    } catch (error) {
      console.error('Error deleting job alert:', error);
      throw error;
    }
  }
}

export const companyInsightsService = new CompanyInsightsService();