import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { INVOICE_STATE } from 'proton-shared/lib/constants';
import { DropdownActions, useApiWithoutResult, useModal, useNotifications } from 'react-components';
import { getInvoice, getPaymentMethodStatus } from 'proton-shared/lib/api/payments';
import { openTabBlob } from 'proton-shared/lib/helpers/file';
import { hasPDFSupport } from 'proton-shared/lib/helpers/browser';
import downloadFile from 'proton-shared/lib/helpers/downloadFile';

import PayInvoiceModal from './PayInvoiceModal';

const InvoiceActions = ({ invoice, fetchInvoices }) => {
    const { request: requestGetInvoice } = useApiWithoutResult(getInvoice);
    const { createNotification } = useNotifications();
    const { isOpen, open, close } = useModal();
    const { request: requestGetPaymentMethodStatus } = useApiWithoutResult(getPaymentMethodStatus);

    const get = async () => {
        const buffer = await requestGetInvoice(invoice.ID);
        const filename = c('Title for PDF file').t`ProtonMail invoice` + ` ${invoice.ID}.pdf`;
        const blob = new Blob([buffer], { type: 'application/pdf' });

        return { blob, filename };
    };

    const list = [
        {
            text: c('Action').t`Download`,
            type: 'button',
            async onClick() {
                const { blob, filename } = await get();
                downloadFile(blob, filename);
            }
        }
    ];

    if (hasPDFSupport()) {
        list.unshift({
            text: c('Action').t`View`,
            type: 'button',
            async onClick() {
                const { blob, filename } = await get();
                openTabBlob(blob, filename);
            }
        });
    }

    if (invoice.State === INVOICE_STATE.UNPAID) {
        list.push({
            text: c('Action').t`Pay`,
            type: 'button',
            async onClick() {
                const { Stripe, Paymentwall } = await requestGetPaymentMethodStatus();
                const canPay = Stripe || Paymentwall;

                if (!canPay) {
                    createNotification({
                        type: 'error',
                        text: c('Error').t`Payments are currently not available, please try again later`
                    });
                }

                open();
            }
        });
    }

    return (
        <>
            <DropdownActions list={list} className="pm-button--small" />
            {invoice.State === INVOICE_STATE.UNPAID ? (
                <PayInvoiceModal invoice={invoice} show={isOpen} onClose={close} fetchInvoices={fetchInvoices} />
            ) : null}
        </>
    );
};

InvoiceActions.propTypes = {
    invoice: PropTypes.object.isRequired,
    fetchInvoices: PropTypes.func.isRequired
};

export default InvoiceActions;
