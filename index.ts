import {startApp} from '@/core/bootstrap';

startApp().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
