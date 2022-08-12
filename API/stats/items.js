const { decodeData, decodeArrayBuffer } = require('../utils/nbt');
const { toTimestamp } = require('../constants/maro_networth/src/helper');
const { toFixed } = require('../constants/functions');

module.exports = async (profile) => {
    const armorPieces = ['helmet', 'chestplate', 'leggings', 'boots']
    const inv_armor = {
        helmet: [],
        chestplate: [],
        leggings: [],
        boots: [],
    };
    const equipment_contents = {
        necklace: [],
        cloak: [],
        belt: [],
        gloves: [],
    }
    const backpack_contents = {}
    const quiver_contents = []
    const talisman_bag = []
    const backpack_icons = {}
    const ender_chest_contents = []
    const inv_contents = []
    const candy_inventory_contents = []
    const fishing_bag_contents = []
    const potion_bag_contents = []
    const personal_vault_contents = []
    const wardrobe_contents = {}

    
    if (profile.inv_armor?.data) {
        const invArmor = (await decodeData(Buffer.from(profile.inv_armor?.data, 'base64'))).i
        for (let i = 0; i < invArmor.length; i++) {

            if (invArmor[i].tag?.ExtraAttributes?.rarity_upgrades) {
                invArmor[i].tag.ExtraAttributes.recombobulated = invArmor[i].tag.ExtraAttributes.rarity_upgrades === 1 ? true : false
                delete(invArmor[i].tag.ExtraAttributes.rarity_upgrades)
            }
            
            if (invArmor[i].tag?.ExtraAttributes?.modifier) {
                invArmor[i].tag.ExtraAttributes.reforge = invArmor[i].tag.ExtraAttributes.modifier ? invArmor[i].tag.ExtraAttributes.modifier : 'None'
                delete(invArmor[i].tag.ExtraAttributes.modifier)
            }
            
            if (invArmor[i].tag?.ExtraAttributes?.donated_museum) {
                invArmor[i].tag.ExtraAttributes.soulbond = invArmor[i].tag?.ExtraAttributes.donated_museum === 1 ? true : false
                delete(invArmor[i].tag.ExtraAttributes.donated_museum) 
            } 
            
            if (invArmor[i].tag?.ExtraAttributes?.timestamp) {
                invArmor[i].tag.ExtraAttributes.timestamp = toTimestamp(invArmor[i].tag.ExtraAttributes.timestamp) | null
            }   

            inv_armor[armorPieces[i]] = invArmor[i]
        }
    }
      
    if (profile.equippment_contents?.data) {
        const equipment = (await decodeData(Buffer.from(profile.equippment_contents?.data, 'base64'))).i
        const equipmentPieces = ['necklace', 'cloak', 'belt', 'gloves']
        for (let i = 0; i < equipment.length; i++) {

            if (equipment[i].tag?.ExtraAttributes?.rarity_upgrades) {
                equipment[i].tag.ExtraAttributes.recombobulated = equipment[i].tag.ExtraAttributes.rarity_upgrades === 1 ? true : false
                delete(equipment[i].tag.ExtraAttributes.rarity_upgrades)
            }
            
            if (equipment[i].tag?.ExtraAttributes?.modifier) {
                equipment[i].tag.ExtraAttributes.reforge = equipment[i].tag.ExtraAttributes.modifier ? equipment[i].tag.ExtraAttributes.modifier : 'None'
                delete(equipment[i].tag.ExtraAttributes.modifier)
            }
            
            if (equipment[i].tag?.ExtraAttributes?.donated_museum) {
                equipment[i].tag.ExtraAttributes.soulbond = equipment[i].tag?.ExtraAttributes.donated_museum === 1 ? true : false
                delete(equipment[i].tag.ExtraAttributes.donated_museum) 
            } 
            
            if (equipment[i].tag?.ExtraAttributes?.timestamp) {
                equipment[i].tag.ExtraAttributes.timestamp = toTimestamp(equipment[i].tag.ExtraAttributes.timestamp) | null
            }   

            equipment_contents[equipmentPieces[i]] = equipment[i] 
        }
    }

    if (profile?.backpack_contents) {
        for (key of Object.keys(profile?.backpack_contents)) {
            const backpack = (await decodeData(Buffer.from(profile.backpack_contents[key].data, 'base64'))).i
            for (let i = 0; i < backpack.length; i++) {
            
                if (backpack[i].tag?.ExtraAttributes?.rarity_upgrades) {
                    backpack[i].tag.ExtraAttributes.recombobulated = backpack[i].tag.ExtraAttributes.rarity_upgrades === 1 ? true : false
                    delete(backpack[i].tag.ExtraAttributes.rarity_upgrades)
                }
            
                if (backpack[i].tag?.ExtraAttributes?.modifier) {
                    backpack[i].tag.ExtraAttributes.reforge = backpack[i].tag.ExtraAttributes.modifier ? backpack[i].tag.ExtraAttributes.modifier : 'None'
                    delete(backpack[i].tag.ExtraAttributes.modifier)
                }
            
                if (backpack[i].tag?.ExtraAttributes?.donated_museum) {
                    backpack[i].tag.ExtraAttributes.soulbond = backpack[i].tag?.ExtraAttributes.donated_museum === 1 ? true : false
                    delete(backpack[i].tag.ExtraAttributes.donated_museum) 
                } 
            
                if (backpack[i].tag?.ExtraAttributes?.timestamp) {
                    backpack[i].tag.ExtraAttributes.timestamp = toTimestamp(backpack[i].tag.ExtraAttributes.timestamp) | null
                }   

                if (!backpack_contents[key]) backpack_contents[key] = []

                backpack[i] ? backpack_contents[key].push(backpack[i]) : backpack_contents[key].push({})
            }
        }
    }

    if (profile.quiver?.data) {
        const quiver = (await decodeData(Buffer.from(profile.quiver?.data, 'base64'))).i
        for (let i = 0; i < quiver.length; i++) {
            quiver[i] ? quiver_contents.push(quiver[i]) : quiver_contents.push({})
        }
    }

    if (profile.talisman_bag?.data) {
        for (const talisman of (await decodeData(Buffer.from(profile.talisman_bag?.data, 'base64'))).i) {

            if (talisman?.tag?.ExtraAttributes?.rarity_upgrades) {
                talisman.tag.ExtraAttributes.recombobulated = talisman?.tag?.ExtraAttributes?.rarity_upgrades === 1 ? true : false
                delete(talisman?.tag?.ExtraAttributes?.rarity_upgrades)
            }

            if (talisman?.tag?.ExtraAttributes?.modifier) {
                talisman.tag.ExtraAttributes.reforge = talisman?.tag?.ExtraAttributes?.modifier ? talisman.tag?.ExtraAttributes.modifier : 'None'
                delete(talisman.tag.ExtraAttributes?.modifier)
            }

            if (talisman?.tag?.ExtraAttributes?.donated_museum) {
                talisman.tag.ExtraAttributes.soulbond = talisman?.tag?.ExtraAttributes?.donated_museum === 1 ? true : false
                delete(talisman.tag.ExtraAttributes?.donated_museum)   
            }

            if (toTimestamp(talisman?.tag?.ExtraAttributes?.timestamp)) talisman.tag.ExtraAttributes.timestamp = toTimestamp(talisman?.tag?.ExtraAttributes?.timestamp) | null

            if (talisman) talisman_bag.push(talisman)
        
        }
    }

    if (profile?.backpack_icons) {
        for (key of Object.keys(profile?.backpack_icons)) {
            const backpackIcon = (await decodeData(Buffer.from(profile.backpack_icons[key].data, 'base64'))).i
            for (let i = 0; i < backpackIcon.length; i++) {
                if (backpackIcon[i].tag?.ExtraAttributes?.timestamp) {
                    backpackIcon[i].tag.ExtraAttributes.timestamp = toTimestamp(backpackIcon[i].tag.ExtraAttributes.timestamp) | null
                }   
        
                if (!backpack_icons[key]) backpack_icons[key] = []
        
                backpackIcon[i] ? backpack_icons[key].push(backpackIcon[i]) : backpack_icons[key].push({})
            }
        }
    }

    if (profile.wardrobe_contents?.data) {
        const wardrobeArmor = (await decodeData(Buffer.from(profile.wardrobe_contents?.data, 'base64'))).i
        for (let i = 0; i < wardrobeArmor.length; i++) {
            for (let j = 0; j < armorPieces.length; j++) {
                if (wardrobeArmor[i].tag?.ExtraAttributes?.rarity_upgrades) {
                    wardrobeArmor[i].tag.ExtraAttributes.recombobulated = wardrobeArmor[i].tag.ExtraAttributes.rarity_upgrades === 1 ? true : false
                    delete(wardrobeArmor[i].tag.ExtraAttributes.rarity_upgrades)
                }
                
                if (wardrobeArmor[i].tag?.ExtraAttributes?.modifier) {
                    wardrobeArmor[i].tag.ExtraAttributes.reforge = wardrobeArmor[i].tag.ExtraAttributes.modifier ? wardrobeArmor[i].tag.ExtraAttributes.modifier : 'None'
                    delete(wardrobeArmor[i].tag.ExtraAttributes.modifier)
                }
                
                if (wardrobeArmor[i].tag?.ExtraAttributes?.donated_museum) {
                    wardrobeArmor[i].tag.ExtraAttributes.soulbond = wardrobeArmor[i].tag?.ExtraAttributes.donated_museum === 1 ? true : false
                    delete(wardrobeArmor[i].tag.ExtraAttributes.donated_museum) 
                } 
                
                if (wardrobeArmor[i].tag?.ExtraAttributes?.timestamp) {
                    wardrobeArmor[i].tag.ExtraAttributes.timestamp = toTimestamp(wardrobeArmor[i].tag.ExtraAttributes.timestamp) | null
                }   

                if (!wardrobe_contents[toFixed(i/4, 0)]) wardrobe_contents[toFixed(i/4, 0)] = {}

                wardrobe_contents[toFixed(i/4, 0)][armorPieces[j]] = wardrobeArmor[i]

                
            }
        }
    }

    if (profile?.ender_chest_contents) {
        const eChest = (await decodeData(Buffer.from(profile.ender_chest_contents.data, 'base64'))).i
        for (const enderChestItem of eChest) {
            if (enderChestItem.tag?.ExtraAttributes?.rarity_upgrades) {
                enderChestItem.tag.ExtraAttributes.recombobulated = enderChestItem.tag.ExtraAttributes.rarity_upgrades === 1 ? true : false
                delete(enderChestItem.tag.ExtraAttributes.rarity_upgrades)
            }
            
            if (enderChestItem.tag?.ExtraAttributes?.modifier) {
                enderChestItem.tag.ExtraAttributes.reforge = enderChestItem.tag.ExtraAttributes.modifier ? enderChestItem.tag.ExtraAttributes.modifier : 'None'
                delete(enderChestItem.tag.ExtraAttributes.modifier)
            }
            
            if (enderChestItem.tag?.ExtraAttributes?.donated_museum) {
                enderChestItem.tag.ExtraAttributes.soulbond = enderChestItem.tag?.ExtraAttributes.donated_museum === 1 ? true : false
                delete(enderChestItem.tag.ExtraAttributes.donated_museum) 
            } 
            
            if (enderChestItem.tag?.ExtraAttributes?.timestamp) {
                enderChestItem.tag.ExtraAttributes.timestamp = toTimestamp(enderChestItem.tag.ExtraAttributes.timestamp) | null
            }   
    
            enderChestItem ? ender_chest_contents.push(enderChestItem) : ender_chest_contents.push({})
        }
    }

    if (profile?.personal_vault_contents) {
        const personalVault = (await decodeData(Buffer.from(profile.personal_vault_contents.data, 'base64'))).i
        for (const persVault of personalVault) {
            if (persVault.tag?.ExtraAttributes?.rarity_upgrades) {
                persVault.tag.ExtraAttributes.recombobulated = persVault.tag.ExtraAttributes.rarity_upgrades === 1 ? true : false
                delete(persVault.tag.ExtraAttributes.rarity_upgrades)
            }
            
            if (persVault.tag?.ExtraAttributes?.modifier) {
                persVault.tag.ExtraAttributes.reforge = persVault.tag.ExtraAttributes.modifier ? persVault.tag.ExtraAttributes.modifier : 'None'
                delete(persVault.tag.ExtraAttributes.modifier)
            }
            
            if (persVault.tag?.ExtraAttributes?.donated_museum) {
                persVault.tag.ExtraAttributes.soulbond = persVault.tag?.ExtraAttributes.donated_museum === 1 ? true : false
                delete(persVault.tag.ExtraAttributes.donated_museum) 
            } 
            
            if (persVault.tag?.ExtraAttributes?.timestamp) {
                persVault.tag.ExtraAttributes.timestamp = toTimestamp(persVault.tag.ExtraAttributes.timestamp) | null
            }   
    
            persVault ? personal_vault_contents.push(persVault) : personal_vault_contents.push({})
        }
    }

    if (profile.fishing_bag?.data) {
        const fishing_bag = (await decodeData(Buffer.from(profile.fishing_bag?.data, 'base64'))).i
        for (let i = 0; i < fishing_bag.length; i++) {
            fishing_bag[i] ? fishing_bag_contents.push(fishing_bag[i]) : fishing_bag_contents.push({})
        }
    }

    if (profile.potion_bag?.data) {
        const potion_bag = (await decodeData(Buffer.from(profile.potion_bag?.data, 'base64'))).i
        for (let i = 0; i < potion_bag.length; i++) {
            potion_bag[i] ? potion_bag_contents.push(potion_bag[i]) : potion_bag_contents.push({})
        }
    }

    if (profile?.inv_contents) {
        const inventory = (await decodeData(Buffer.from(profile.inv_contents.data, 'base64'))).i
        for (let i = 0; i < inventory.length; i++) {

            if (inventory[i].tag?.ExtraAttributes?.rarity_upgrades) {
                inventory[i].tag.ExtraAttributes.recombobulated = inventory[i].tag.ExtraAttributes.rarity_upgrades === 1 ? true : false
                delete(inventory[i].tag.ExtraAttributes.rarity_upgrades)
            }
            
            if (inventory[i].tag?.ExtraAttributes?.modifier) {
                inventory[i].tag.ExtraAttributes.reforge = inventory[i].tag.ExtraAttributes.modifier ? inventory[i].tag.ExtraAttributes.modifier : 'None'
                delete(inventory[i].tag.ExtraAttributes.modifier)
            }
            
            if (inventory[i].tag?.ExtraAttributes?.donated_museum) {
                inventory[i].tag.ExtraAttributes.soulbond = inventory[i].tag?.ExtraAttributes.donated_museum === 1 ? true : false
                delete(inventory[i].tag.ExtraAttributes.donated_museum) 
            } 
            
            if (inventory[i].tag?.ExtraAttributes?.timestamp) {
                inventory[i].tag.ExtraAttributes.timestamp = toTimestamp(inventory[i].tag.ExtraAttributes.timestamp) | null
            }   
    
            inventory[i] ? inv_contents.push(inventory[i]) : inv_contents.push({})
        }
        
    }

    if (profile?.candy_inventory_contents) {
        const candy_inventory = (await decodeData(Buffer.from(profile.candy_inventory_contents.data, 'base64'))).i
        for (let i = 0; i < candy_inventory.length; i++) {
            if (candy_inventory[i].tag?.ExtraAttributes?.rarity_upgrades) {
                candy_inventory[i].tag.ExtraAttributes.recombobulated = candy_inventory[i].tag.ExtraAttributes.rarity_upgrades === 1 ? true : false
                delete(candy_inventory[i].tag.ExtraAttributes.rarity_upgrades)
            }
            
            if (candy_inventory[i].tag?.ExtraAttributes?.timestamp) {
                candy_inventory[i].tag.ExtraAttributes.timestamp = toTimestamp(candy_inventory[i].tag.ExtraAttributes.timestamp) | null
            }   
    
            candy_inventory[i] ? candy_inventory_contents.push(candy_inventory[i]) : candy_inventory_contents.push({})
        }
        
    }


    return {
        inv_armor,
        equipment_contents,
        backpack_contents,
        quiver_contents,
        talisman_bag,
        backpack_icons,
        ender_chest_contents,
        potion_bag_contents,
        fishing_bag_contents,
        personal_vault_contents,
        wardrobe_contents,
        inv_contents,
        candy_inventory_contents,
    }

};
