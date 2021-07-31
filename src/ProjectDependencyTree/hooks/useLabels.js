import { useEffect, useState } from 'react';
import { getLabels } from '../../todoist_api_adapter';

export const useLabels = () => {
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState([]);
  useEffect(() => {
    async function fetchLabels() {
      const labels = await getLabels();
      setLabels(labels);
      setLoading(false);
    }
    fetchLabels();
  }, []);
  return [labels, loading]
}