import { RouterProps } from '@reach/router';
import * as React from 'react';
import { ArticleQueryData } from '../interfaces/Article.interface';
import Layout from '../components/layout';
import TopSection from '../components/topSection';
import PageBottom from '../components/pageBottom';
import SEO from '../components/seo';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';

import styled from 'styled-components';

type ArticleLayoutProps = ArticleQueryData & RouterProps;

const BlockContent = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 8px rgba(47, 55, 71, 0.05),
    0px 1px 3px rgba(47, 55, 71, 0.1);
  border-radius: 5px;
  margin-top: 1rem;
  padding: 40px;
`;

const ArticleLayout = ({ data, ...props }: ArticleLayoutProps) => {
  if (!data) {
    return null;
  }
  const {
    allMdx,
    mdx: {
      fields: { slug },
      frontmatter: { title, metaTitle, metaDescription },
      body,
    },
  } = data;

  // Parent title extraction
  const allContent =
    allMdx && allMdx.edges && allMdx.edges.map((mdx: any) => mdx.node.fields);

  allContent?.map((content: any) => {
    content.parentTitle = '';
    const parts = content.slug.split('/');
    const slicedParts = parts.slice(1, parts.length - 1);
    slicedParts.forEach((part: any) => {
      const parent = allContent.find(ac => {
        const parentParts = ac.slug.split('/');
        return (
          parentParts[parentParts.length - 1] === 'index' &&
          parentParts[parentParts.length - 2] === part
        );
      });
      content.parentTitle = content.parentTitle + parent?.title + ' / ';
    });
  });

  const getParentTitle = () =>
    allContent?.find(mdx => mdx.slug === slug).parentTitle.slice(0, -2);

  return (
    <Layout {...props}>
      <SEO title={metaTitle} description={metaDescription} />
      <BlockContent>
        <TopSection
          location={props.location}
          title={title}
          parentTitle={getParentTitle()}
        />
      </BlockContent>
      <BlockContent>
        <MDXRenderer>{body}</MDXRenderer>
      </BlockContent>
      <PageBottom />
    </Layout>
  );
};

export default ArticleLayout;

export const query = graphql`
  query($id: String!) {
    mdx(fields: { id: { eq: $id } }) {
      fields {
        title
        slug
        id
      }
      body
      tableOfContents
      frontmatter {
        title
        metaTitle
        metaDescription
      }
    }
    allMdx {
      edges {
        node {
          fields {
            slug
            title
          }
        }
      }
    }
  }
`;