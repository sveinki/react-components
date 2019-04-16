import React from 'react';
import { c } from 'ttag';
import { SubTitle, Alert, Row, Label, Loader, useOrganization } from 'react-components';

import OrganizationName from './OrganizationName';
import ActivateOrganizationButton from './ActivateOrganizationButton';

const OrganizationSection = () => {
    const [organization, loading] = useOrganization();

    if (loading) {
        return <Loader />;
    }

    if (!organization.HasKeys) {
        return (
            <>
                <SubTitle>{c('Title').t`Multi-user support`}</SubTitle>
                <Alert learnMore="https://protonmail.com/support/knowledge-base/business/">{c('Info')
                    .t`Create and manage sub-accounts and assign them email addresses on your custom domain.`}</Alert>
                <ActivateOrganizationButton />
            </>
        );
    }

    return (
        <>
            <SubTitle>{c('Title').t`Organization`}</SubTitle>
            <Alert learnMore="todo">{c('Info')
                .t`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.`}</Alert>
            <Row>
                <Label>{c('Label').t`Organization name`}</Label>
                <OrganizationName organization={organization} />
            </Row>
        </>
    );
};

export default OrganizationSection;
