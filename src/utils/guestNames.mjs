
const GUEST_NAMES = [ 'unicorn', 'dragon', 'phoenix', 'griffin', 'pegasus', 'hydra', 'cerberus', 'chimera', 'basilisk', 'kraken', 'sphinx', 'minotaur', 'manticore', 'wyvern', 'hippogriff', 'leviathan', 'kelpie', 'banshee', 'kitsune', 'roc'];
    
export const generateGuestName = () => {
    const randomName = GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)];
    const randomNumber = Math.floor(Math.random() * 900) + 100;

    return `${randomName}${randomNumber}`;
}
// random * 900 ger 0-899.99, floor avrundar neråt, +100 ger 100-999