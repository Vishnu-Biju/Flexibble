"use client"
import { useEffect, useState } from 'react';
import Categories from '@/components/Categories';
import LoadMore from '@/components/LoadMore';
import ProjectCard from '@/components/ProjectCard';
import { fetchAllProjects } from '@/lib/actions';

type SearchParams = {
  category?: string | null;
  endCursor?: string | null;
};

type Props = {
  searchParams: SearchParams;
};

type ProjectInterface = {
  id: string;
  image: string;
  title: string;
  createdBy: {
    name: string;
    avatarUrl: string;
    id: string;
  };
};

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

const Home: React.FC<Props> = ({ searchParams: { category: initialCategory = null, endCursor } }) => {
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [projects, setProjects] = useState<ProjectInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (category === null) {
        // Fetch all projects when category is null
        const data = await fetchAllProjects(null, endCursor) as ProjectSearch;
        const projectsToDisplay = data?.projectSearch?.edges.map(edge => edge.node) || [];
        setProjects(projectsToDisplay);
      } else {
        // Fetch projects filtered by category
        const data = await fetchAllProjects(category, endCursor) as ProjectSearch;
        const projectsToDisplay = data?.projectSearch?.edges.map(edge => edge.node) || [];
        setProjects(projectsToDisplay);
      }
    };

    fetchData();
  }, [category, endCursor]);

  useEffect(() => {
    setCategory(initialCategory);
    setProjects([]);
  }, [initialCategory]);

  const handleCategoryChange = (selectedCategory: string | null) => {
    setCategory(selectedCategory);
  };

  if (projects.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories category={category} onCategoryChange={handleCategoryChange} />
        <p className="no-result-text text-center">No projects found, go create some first.</p>
      </section>
    );
  }

  return (
    <section className="flexStart flex-col paddings mb-16">
      <Categories category={category} onCategoryChange={handleCategoryChange} />
      <section className="projects-grid">
        {projects.map(node => (
          <ProjectCard
            key={`${node?.id}`}
            id={node?.id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy.name}
            avatarUrl={node?.createdBy.avatarUrl}
            userId={node?.createdBy.id}
          />
        ))}
      </section>
      <LoadMore
        startCursor={''}
        endCursor={''}
        hasPreviousPage={false}
        hasNextPage={false}
      />
    </section>
  );
};

export default Home;
