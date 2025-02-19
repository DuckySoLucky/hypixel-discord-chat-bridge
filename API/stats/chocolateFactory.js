// CREDITS: by @Kathund (https://github.com/Kathund)

module.exports = (profile) => {
  try {
    if (!profile.events?.easter) {
      return null;
    }

    return {
      chocolate: {
        current: profile.events?.easter?.chocolate || 0,
        sincePrestige: profile.events?.easter?.chocolate_since_prestige || 0,
        total: profile.events?.easter?.total_chocolate || 0
      },
      employees: {
        bro: profile.events?.easter?.employees.rabbit_bro || 0,
        cousin: profile.events?.easter?.employees.rabbit_cousin || 0,
        sis: profile.events?.easter?.employees.rabbit_sis || 0,
        father: profile.events?.easter?.employees.rabbit_father || 0,
        grandma: profile.events?.easter?.employees.rabbit_grandma || 0
      },
      level: profile.events?.easter?.chocolate_level || 0
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
