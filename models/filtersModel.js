import { FiltersModel } from 'proton-shared/lib/models/filtersModel';
import createUseModelHook from './helpers/createModelHook';

export const useFilters = createUseModelHook(FiltersModel);
