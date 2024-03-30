export function firstCap(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function propCap(str: string) {
    return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).toString().replaceAll(',', '');
}