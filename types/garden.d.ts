export type Garden = {
  uuid: string;
  unlocked_plots_ids: string[];
  commission_data: {
    visits?: Record<string, number>;
    completed?: Record<string, number>;
    total_completed?: number;
    unique_npcs_served?: number;
  };
  resources_collected: Record<string, number>;
  composter_data: {
    organic_matter?: number;
    fuel_units?: number;
    compost_units?: number;
    compost_items?: number;
    conversion_ticks?: number;
    last_save?: number;
    upgrades?: Record<string, number>;
  };
  garden_experience: number;
  selected_barn_skin: string;
  crop_upgrade_levels: Record<string, number>;
  unlocked_barn_skins: string[];
};
