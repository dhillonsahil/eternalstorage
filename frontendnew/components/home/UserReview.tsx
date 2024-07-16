import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

const reviews = [
    {
      name: "Rishi Kapoor",
      username: "@rishi",
      body: "The sharing feature is fantastic! I can easily share files with anyone without any hassle. Love it!",
      img: "https://avatar.vercel.sh/jack",
    },
    {
      name: "Robin Gill",
      username: "@robingill",
      body: "Deleting and restoring files is so straightforward. It gives me peace of mind knowing I can restore files if I delete them by mistake.",
      img: "https://avatar.vercel.sh/jill",
    },
    {
      name: "Neeraj Dhillon",
      username: "@neerajdhillon",
      body: "I appreciate the option to permanently delete files. It's great to have control over my data like this.",
      img: "https://avatar.vercel.sh/john",
    },
    {
      name: "Jane",
      username: "@jane",
      body: "Marking files as favorite helps me quickly access the documents I use the most. This feature is a lifesaver!",
      img: "https://avatar.vercel.sh/jane",
    },
    {
      name: "Sumit kundu",
      username: "@sumit",
      body: "The restore feature is amazing! I accidentally deleted an important file, but I was able to restore it in seconds.",
      img: "https://avatar.vercel.sh/jenny",
    },
    {
      name: "Ajay verma",
      username: "@ajayverma",
      body: "I love the flexibility of sharing files with anyone. It makes collaboration so much easier.",
      img: "https://avatar.vercel.sh/james",
    },
  ];
  

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function UserReviews() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
