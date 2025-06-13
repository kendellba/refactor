import { computed } from 'vue';
import { useDemoStore } from '@/store/demoStore';

export function useHolderType() {
  const store = useDemoStore();

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return null;
    }

    // Make sure we're working with a date string in a consistent format
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      console.error('Invalid date of birth:', dateOfBirth);
      return null;
    }

    console.log('Calculating age for DOB:', dateOfBirth);
    console.log('Birth date object:', birthDate);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    console.log('Calculated age:', age);
    return age;
  };

  // Determine holder type based on age
  const determineHolderType = (dateOfBirth) => {
    const age = calculateAge(dateOfBirth);
    console.log('Age for holder type determination:', age);

    if (age === null) {
      console.warn('Could not determine age, defaulting to Adult');
      return 'Adult';
    }

    // If under 18, the account holder is a Child, otherwise Adult
    const holderType = age < 18 ? 'Child' : 'Adult';
    console.log('Determined holder type:', holderType);
    return holderType;
  };

  // Get holder type from basic info date of birth
  const getHolderTypeFromStore = () => {
    console.log('Getting holder type from store');
    console.log('Basic info in store:', store.basicInfo);
    console.log('DOB value:', store.basicInfo?.dob);
    console.log('DOB type:', typeof store.basicInfo?.dob);
    console.log('DOB length:', store.basicInfo?.dob?.length);

    // Check if we can calculate it from basic info
    if (store.basicInfo && store.basicInfo.dob) {
      console.log('Found DOB in basic info:', store.basicInfo.dob);
      const calculatedType = determineHolderType(store.basicInfo.dob);
      if (calculatedType) {
        console.log('Returning calculated holder type:', calculatedType);
        return calculatedType;
      }
    } else {
      console.log('No DOB found - basicInfo exists:', !!store.basicInfo);
      console.log('DOB exists:', !!store.basicInfo?.dob);
      console.log('DOB is empty string:', store.basicInfo?.dob === '');
    }

    // Default to Adult if we can't determine
    console.warn('Could not determine holder type from store, defaulting to Adult');
    return 'Adult';
  };

  // Computed property for holder type
  const holderType = computed(() => {
    const type = getHolderTypeFromStore();
    console.log('Computed holder type:', type);
    return type;
  });

  // Computed properties for specific holder types
  const isChild = computed(() => {
    const result = holderType.value === 'Child';
    console.log('isChild computed property:', result);
    return result;
  });

  const isAdult = computed(() => {
    const result = holderType.value === 'Adult';
    console.log('isAdult computed property:', result);
    return result;
  });

  // Function to update holder type in store
  const updateHolderType = (newHolderType) => {
    console.log('Updating holder type in store to:', newHolderType);
    if (store.idInfo) {
      store.$patch((state) => {
        state.idInfo = {
          ...state.idInfo,
          holder_type: newHolderType,
        };
      });
    } else {
      // If idInfo doesn't exist yet, create it
      store.$patch((state) => {
        state.idInfo = {
          holder_type: newHolderType,
        };
      });
    }
  };

  return {
    holderType,
    isChild,
    isAdult,
    calculateAge,
    determineHolderType,
    updateHolderType,
  };
}
