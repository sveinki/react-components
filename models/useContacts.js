import { ContactsModel } from 'proton-shared/lib/models/contactsModel';
import createUseModelHook from './helpers/createModelHook';

export const useContacts = createUseModelHook(ContactsModel);
