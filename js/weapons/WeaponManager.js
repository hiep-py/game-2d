// Manager để quản lý tất cả vũ khí trong game
// Giúp dễ dàng thêm vũ khí mới và quản lý chúng

import { Sword } from './Sword.js';
import { Bow } from './Bow.js';
import { Axe } from './Axe.js';

export class WeaponManager {
    constructor() {
        // Danh sách tất cả loại vũ khí có sẵn
        this.weaponTypes = {
            sword: Sword,
            bow: Bow,
            axe: Axe
        };
    }

    // Tạo vũ khí mới
    createWeapon(type, scene, player) {
        const WeaponClass = this.weaponTypes[type];
        if (WeaponClass) {
            return new WeaponClass(scene, player);
        }
        console.warn(`Weapon type "${type}" not found`);
        return null;
    }

    // Đăng ký vũ khí mới (để mở rộng)
    registerWeapon(name, weaponClass) {
        this.weaponTypes[name] = weaponClass;
    }

    // Lấy danh sách tất cả vũ khí
    getAvailableWeapons() {
        return Object.keys(this.weaponTypes);
    }

    // Tạo tất cả vũ khí cho player
    createAllWeapons(scene, player) {
        const weapons = [];
        for (const type in this.weaponTypes) {
            const weapon = this.createWeapon(type, scene, player);
            if (weapon) {
                weapons.push(weapon);
            }
        }
        return weapons;
    }
}
