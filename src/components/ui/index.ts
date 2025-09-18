// Enhanced UI Components
export { EnhancedInput, enhancedInputVariants } from './enhanced-input';
export { 
  EnhancedModal,
  EnhancedModalHeader,
  EnhancedModalTitle,
  EnhancedModalDescription,
  EnhancedModalFooter,
  EnhancedModalTrigger,
  EnhancedModalClose,
  enhancedModalVariants
} from './enhanced-modal';
export { EnhancedThemeProvider, useEnhancedTheme, themeVariables } from './enhanced-theme-provider';

// Existing UI Components (re-exported for convenience)
export { Button, buttonVariants } from './button';
export { Input } from './input';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { Badge, badgeVariants } from './badge';
export { Avatar, AvatarImage, AvatarFallback } from './avatar';
export { Separator } from './separator';
export { Skeleton } from './skeleton';
export { Progress } from './progress';
export { Switch } from './switch';
export { Checkbox } from './checkbox';
export { RadioGroup, RadioGroupItem } from './radio-group';
export { Label } from './label';
export { Textarea } from './textarea';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
export { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from './dialog';
export { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger
} from './dropdown-menu';
export { Popover, PopoverContent, PopoverTrigger } from './popover';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
export { HoverCard, HoverCardContent as HoverCardTrigger } from './hover-card';
export { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';
export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb';
export { Calendar } from './calendar';
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';
export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './command';
export { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from './context-menu';
export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from './drawer';
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField } from './form';
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp';
export { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from './menubar';
export { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, navigationMenuTriggerStyle } from './navigation-menu';
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination';
export { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';
export { ScrollArea, ScrollBar } from './scroll-area';
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar } from './sidebar';
export { Slider } from './slider';
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table';
export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast';
export { Toaster } from './toaster';
export { Toggle, toggleVariants } from './toggle';
export { ToggleGroup, ToggleGroupItem } from './toggle-group';
export { toast, useToast } from './use-toast';

// Custom Enhanced Components
export { default as PixelCard } from './PixelCard';
export { EnhancedCard } from './enhanced-card';
export { AnimatedBackground } from './animated-background';
export { default as ElectricBorder } from './ElectricBorder';
export { FloatingElements } from './floating-elements';
export { GradientText } from './gradient-text';
export { default as RippleGrid } from './RippleGrid';
export { ScrollReveal } from './scroll-reveal';
export { StatCard } from './stat-card';
export { CompactProgressCard } from './compact-progress-card';
