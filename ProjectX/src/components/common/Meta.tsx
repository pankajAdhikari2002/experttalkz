import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaProps {
  title: string;
  description: string;
}

const Meta: React.FC<MetaProps> = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Meta;
