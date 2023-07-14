// import { ProjectInterface } from "@/common.types";
// import Categories from "@/components/Categories";
// import LoadMore from "@/components/LoadMore";
// import ProjectCard from "@/components/ProjectCard";
// import { fetchAllProjects } from "@/lib/actions";

// type SearchParams = {
//   category?: string | null;
//   endCursor?: string | null;
// }

// type Props = {
//   searchParams: SearchParams
// }

// type ProjectSearch = {
//   projectSearch: {
//     edges: { node: ProjectInterface }[];
//     pageInfo: {
//       hasPreviousPage: boolean;
//       hasNextPage: boolean;
//       startCursor: string;
//       endCursor: string;
//     };
//   },
// }

// export const dynamic = 'force-dynamic';
// export const dynamicParams = true;
// export const revalidate = 0;

// const Home = async ({ searchParams: { category, endCursor } }: Props) => {
//   const data = await fetchAllProjects(category, endCursor) as ProjectSearch

//   const projectsToDisplay = data?.projectSearch?.edges || [];

//   if (projectsToDisplay.length === 0) {
//     return (
//       <section className="flexStart flex-col paddings">
//         <Categories />

//         <p className="no-result-text text-center">No projects found, go create some first.</p>
//       </section>
//     )
//   }

//   return (
//     <section className="flexStart flex-col paddings mb-16">
//       <Categories />

//       <section className="projects-grid">
//         {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (
//           <ProjectCard
//             key={`${node?.id}`}
//             id={node?.id}
//             image={node?.image}
//             title={node?.title}
//             name={node?.createdBy.name}
//             avatarUrl={node?.createdBy.avatarUrl}
//             userId={node?.createdBy.id}
//           />
//         ))}
//       </section>

//       <LoadMore 
//         startCursor={data?.projectSearch?.pageInfo?.startCursor} 
//         endCursor={data?.projectSearch?.pageInfo?.endCursor} 
//         hasPreviousPage={data?.projectSearch?.pageInfo?.hasPreviousPage} 
//         hasNextPage={data?.projectSearch?.pageInfo.hasNextPage}
//       />
//     </section>
//   )
// };

// export default Home;
"use client"

import { useState, useEffect } from 'react';
import Categories from '@/components/Categories';
import LoadMore from '@/components/LoadMore';
import ProjectCard from '@/components/ProjectCard';
import { fetchAllProjects } from '@/lib/actions';
import { ProjectInterface } from '@/common.types';

type ProjectSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
};

type Props = {
  searchParams: {
    category?: string | null;
    endCursor?: string | null;
  };
};

const Home = ({ searchParams: { category, endCursor } }: Props) => {
  const [projects, setProjects] = useState<ProjectInterface[]>([]);
  const [data, setData] = useState<ProjectSearch | null>(null);
  const [hasMoreProjects, setHasMoreProjects] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [category, endCursor]);

  const fetchData = async () => {
    let fetchedData: ProjectSearch;

    if (category === undefined) {
      // Fetch all projects
      fetchedData = await fetchAllProjects(null, endCursor) as ProjectSearch;
    } else {
      // Fetch projects based on category
      fetchedData = await fetchAllProjects(category, endCursor) as ProjectSearch;
    }

    const projectsToDisplay = fetchedData?.projectSearch?.edges.map(({ node }) => node) || [];
    setProjects(projectsToDisplay);
    setData(fetchedData);

    const hasMore = fetchedData?.projectSearch?.pageInfo?.hasNextPage || false;
    setHasMoreProjects(hasMore);
  };

  if (projects.length === 0 && category !== undefined) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />
        <p className="no-result-text text-center">No projects found, go create some first.</p>
      </section>
    );
  }

  return (
    <section className="flexStart flex-col paddings mb-16">
      <Categories />
      <section className="projects-grid">
        {projects.map(({ id, image, title, createdBy }) => (
          <ProjectCard
            key={id}
            id={id}
            image={image}
            title={title}
            name={createdBy.name}
            avatarUrl={createdBy.avatarUrl}
            userId={createdBy.id}
          />
        ))}
      </section>
      {data?.projectSearch?.pageInfo?.hasNextPage && (
        <LoadMore
          startCursor={data?.projectSearch?.pageInfo?.startCursor}
          endCursor={data?.projectSearch?.pageInfo?.endCursor}
          hasPreviousPage={data?.projectSearch?.pageInfo?.hasPreviousPage}
          hasNextPage={data?.projectSearch?.pageInfo?.hasNextPage}
        />
      )}
    </section>
  );
};

export default Home;
