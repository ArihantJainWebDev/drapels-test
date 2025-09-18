import { Clock, MapPin, Award, Users, Calendar, Briefcase, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface OpportunityCardProps {
  title: string;
  company: string;
  type: 'hackathon' | 'internship' | 'job' | 'workshop' | 'scholarship';
  location: string;
  deadline: string;
  participants?: number;
  prize?: string;
  isFeatured?: boolean;
  skills?: string[];
}

export function OpportunityCard({
  title,
  company,
  type,
  location,
  deadline,
  participants,
  prize,
  isFeatured = false,
  skills = [],
}: OpportunityCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'hackathon':
        return <Award className="w-4 h-4 text-warning" />;
      case 'internship':
        return <Briefcase className="w-4 h-4 text-primary" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-success" />;
      case 'workshop':
        return <BookOpen className="w-4 h-4 text-secondary" />;
      case 'scholarship':
        return <Award className="w-4 h-4 text-error" />;
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getTypeIcon()}
              <span className="text-sm font-medium text-muted-foreground">
                {getTypeLabel()}
              </span>
            </div>
            <CardTitle className="text-xl font-bold line-clamp-2">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{company}</p>
          </div>
          {isFeatured && (
            <Badge
              variant="default"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-warm"
            >
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Ends {deadline}</span>
          </div>
          {participants !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{participants.toLocaleString()} participants</span>
            </div>
          )}
          {prize && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-warning" />
              <span className="font-medium">Prize: {prize}</span>
            </div>
          )}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-warm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default OpportunityCard;
