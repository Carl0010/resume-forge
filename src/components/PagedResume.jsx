import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Resume from '../templates/Resume.jsx';
import { paginateResume } from '../lib/paginate.js';

export default function PagedResume({
  resume,
  templateId,
  overrides,
  pageSize = 'A4',
  onPagination,
}) {
  const measure = useRef(null);
  const pages = useRef(null);
  const callback = useRef(onPagination);
  callback.current = onPagination;
  const [result, setResult] = useState({ html: '', error: '' });
  useLayoutEffect(() => {
    let frame,
      disposed = false;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed) return;
        try {
          const next = paginateResume(measure.current.firstElementChild, pages.current);
          setResult({ html: next.html, error: '', resume, templateId, overrides, pageSize });
          callback.current?.(next.count);
        } catch (error) {
          setResult({ html: '', error: error.message });
          callback.current?.(0);
        }
      });
    };
    run();
    const observer = new ResizeObserver(run);
    observer.observe(measure.current);
    measure.current.addEventListener('load', run, true);
    document.fonts?.addEventListener('loadingdone', run);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      measure.current?.removeEventListener('load', run, true);
      document.fonts?.removeEventListener('loadingdone', run);
    };
  }, [resume, templateId, overrides, pageSize]);
  return (
    <>
      {createPortal(
        <div className="resume-measure" aria-hidden="true">
          <div ref={measure}>
            <Resume
              resume={resume}
              templateId={templateId}
              overrides={overrides}
              pageSize={pageSize}
            />
          </div>
          <div ref={pages} />
        </div>,
        document.body,
      )}
      {result.error ? (
        <p className="pagination-error" role="alert">
          {result.error}
        </p>
      ) : (
        <div
          className="resume-pages"
          data-ready={
            result.resume === resume &&
            result.templateId === templateId &&
            result.overrides === overrides &&
            result.pageSize === pageSize
          }
          dangerouslySetInnerHTML={{ __html: result.html }}
        />
      )}
    </>
  );
}
