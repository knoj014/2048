import './Block.css'

function Block({ num }: { num: number }) {
    const defaultColor = { background: '#cdc1b4', text: '#776e65' };
    const colors: { [key: number]: { background: string, text: string } } = {
        2: { background: '#eee4da', text: '#776e65' },
        4: { background: '#eee1c9', text: '#776e65' },
        8: { background: '#f3b27a', text: '#f9f6f2' },
        16: { background: '#f69664', text: '#f9f6f2' },
        32: { background: '#f77c5f', text: '#f9f6f2' },
        64: { background: '#f75f3b', text: '#f9f6f2' },
        128: { background: '#edd073', text: '#f9f6f2' }
    }

    const { background, text } = colors[num] || defaultColor;

    return (
        <div className='block' style={{ backgroundColor: background, color: text }}>
            {num !== 0 ? num : ''}
        </div>
    );
}

export default Block;
