'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ApplicationStatus, CreateJobApplicationDTO, JobApplication } from '@/types/job-application';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createApplication, updateApplication } from '@/app/(student)/applications/actions';
import { toast } from 'sonner';
import { useState } from 'react';

const formSchema = z.object({
    role: z.string().min(1, 'Role is required'),
    company: z.string().min(1, 'Company is required'),
    location: z.string().min(1, 'Location is required'),
    pay: z.string().optional(),
    status: z.enum([
        'saved', 'preparing', 'applied',
        'interview_round_1', 'interview_round_2', 'interview_round_3', 'interview_final',
        'offer_received', 'accepted', 'rejected', 'withdrawn'
    ] as [string, ...string[]]),
    date_applied: z.string().optional(),
    application_deadline: z.string().optional(),
    next_steps: z.string().optional(),
    link: z.string().url('Invalid URL').optional().or(z.literal('')),
    resume_version: z.string().optional(),
    contact_person: z.string().optional(),
    interview_stage: z.string().optional(),
    comments: z.string().optional(),
});

interface JobApplicationFormProps {
    application?: JobApplication;
    onSuccess?: () => void;
}

export function JobApplicationForm({ application, onSuccess }: JobApplicationFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: application?.role || '',
            company: application?.company || '',
            location: application?.location || '',
            pay: application?.pay || '',
            status: application?.status || 'saved',
            date_applied: application?.date_applied || '',
            application_deadline: application?.application_deadline || '',
            next_steps: application?.next_steps || '',
            link: application?.link || '',
            resume_version: application?.resume_version || '',
            contact_person: application?.contact_person || '',
            interview_stage: application?.interview_stage || '',
            comments: application?.comments || '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Clean up empty strings to null/undefined where appropriate if backend expects it
            // But our DTO allows strings.

            const payload: CreateJobApplicationDTO = {
                ...values,
                status: values.status as ApplicationStatus,
                // Convert empty strings to null for optional fields if needed, or keep as string
                // Supabase handles empty strings fine, but usually null is better for "no value"
                date_applied: values.date_applied || null,
                application_deadline: values.application_deadline || null,
                pay: values.pay || null,
                next_steps: values.next_steps || null,
                link: values.link || null,
                resume_version: values.resume_version || null,
                contact_person: values.contact_person || null,
                interview_stage: values.interview_stage || null,
                comments: values.comments || null,
            };

            let result;
            if (application) {
                result = await updateApplication(application.id, payload);
            } else {
                result = await createApplication(payload);
            }

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(application ? 'Application updated' : 'Application created');
                onSuccess?.();
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Product Manager" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Google" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location *</FormLabel>
                                <FormControl>
                                    <Input placeholder="New York, NY" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="saved">Saved/Interested</SelectItem>
                                        <SelectItem value="preparing">Preparing</SelectItem>
                                        <SelectItem value="applied">Applied</SelectItem>
                                        <SelectItem value="interview_round_1">Interview - Round 1</SelectItem>
                                        <SelectItem value="interview_round_2">Interview - Round 2</SelectItem>
                                        <SelectItem value="interview_round_3">Interview - Round 3</SelectItem>
                                        <SelectItem value="interview_final">Interview - Final</SelectItem>
                                        <SelectItem value="offer_received">Offer Received</SelectItem>
                                        <SelectItem value="accepted">Accepted</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date_applied"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date Applied</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="application_deadline"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deadline</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="pay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pay</FormLabel>
                                <FormControl>
                                    <Input placeholder="$100k/yr" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="resume_version"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Resume Version</FormLabel>
                                <FormControl>
                                    <Input placeholder="v1.pdf" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Link</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="contact_person"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Person</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name (email)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="interview_stage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interview Stage Details</FormLabel>
                                <FormControl>
                                    <Input placeholder="Technical with Team Lead" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="next_steps"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Next Steps / Follow-up</FormLabel>
                            <FormControl>
                                <Input placeholder="Follow up on Monday" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comments</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Notes about the role..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : application ? 'Update Application' : 'Add Application'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
