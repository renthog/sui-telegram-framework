import root from './root';
import sendSui from './sendSui';
import wallet from './wallet';

root.register(wallet);
root.register(sendSui);

export default root;
