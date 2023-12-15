import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import { toast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations"

type PostFormProps = {
    post?: Models.Document
}

const PostForm = ({ post }: PostFormProps) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { mutateAsync: createPost } = useCreatePost();

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post.caption : "",
            file: post ? post.file : null,
            tags: post ? post.tags : []
        },
    })

    async function onSubmit(values: z.infer<typeof PostValidation>) {
        const newPost = await createPost({
            ...values,
            tags: values.tags?.replace(/ /g, "").split(",") || [],
            userId: user.id
        });

        if (!newPost) {
            return toast({
                title: 'Please try again.'
            })
        }
        else {
            navigate('/');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Caption</FormLabel>
                            <FormControl>
                                <Textarea className="shad-textarea custom-scrollbar" {...field} />
                            </FormControl>
                            <FormMessage className="sha-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add a photo</FormLabel>
                            <FormControl>
                                <FileUploader fieldOnChange={field.onChange} mediaUrl={post?.imageUrl} />
                            </FormControl>
                            <FormMessage className="sha-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add tags (separated by comma)</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="sha-form_message" />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='shad-button_primary w-20'>
                    Submit
                </Button>
            </form>
        </Form>
    )
}

export default PostForm