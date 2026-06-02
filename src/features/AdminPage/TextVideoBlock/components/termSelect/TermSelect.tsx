import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import TermsApi from '@api/streetcode/text-content/terms.api';
import { Term } from '@models/streetcode/text-contents.model';

import '../TextVideoBlockForm.styles.scss';

type Props = {
    value?: Term | null;
    onSelect: (term: Term | null) => void;
};

const TermSelect: React.FC<Props> = ({
    value,
    onSelect,
}) => {
    const [terms, setTerms] = useState<Term[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response = await TermsApi.getAll();
                setTerms(response ?? []);
            } catch (e) {
                console.error(e);
            }
        };

        fetchTerms();
    }, []);

    const options = useMemo(() => {
        return terms
            .filter((term) =>
                term.title
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
            .map((term) => ({
                value: term.id,
                label: term.title,
                term,
            }));
    }, [terms, search]);

    return (
        <Select
            showSearch
            value={value?.id}
            placeholder="Оберіть термін"
            className="text-video-form__select"
            filterOption={false}
            onSearch={(val) => setSearch(val)}
            onChange={(_, option: any) => {
                onSelect(option?.term ?? null);
            }}
            options={options}
            allowClear
        />
    );
};

export default TermSelect;